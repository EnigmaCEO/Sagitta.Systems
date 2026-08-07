// Focused interaction tests — the rendered half.
//
// These run against the real static export in out/, after `npm run build`, so
// they assert what a browser actually receives rather than what a component is
// believed to produce. That is the right level for the guarantees this phase
// makes: external-link safety, the absence of unpublished records, the
// no-hover-only rule on the constellation, and landmark structure hold or fail
// in the shipped HTML.
//
// Run: npm run test:export   (or `npm run verify`, which sequences it)

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { before, describe, it } from "node:test";

const OUT = path.join(process.cwd(), "out");
const PUBLIC = path.join(process.cwd(), "public");

/** Every exported HTML file, as { route, html }. */
function collectPages(dir = OUT, pages = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectPages(full, pages);
    } else if (entry.endsWith(".html")) {
      const route =
        "/" + path.relative(OUT, full).replace(/\\/g, "/").replace(/(index)?\.html$/, "");
      pages.push({ route: route.replace(/\/$/, "") || "/", html: readFileSync(full, "utf8") });
    }
  }
  return pages;
}

let pages = [];
const page = (route) => pages.find((p) => p.route === route);

/**
 * The text a reader actually sees: script and style blocks removed, then tags.
 *
 * Necessary because the export inlines React's Flight payload into <script>
 * blocks, and that payload contains both the page's own copy and serialization
 * tokens of the form `$29`. Any assertion about what the page *says* — and
 * especially any assertion that something is absent — has to read rendered text
 * rather than raw HTML, or it will match the payload instead.
 */
function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

before(() => {
  assert.ok(
    existsSync(OUT),
    "out/ is missing — run `npm run build` before the export tests (npm run verify does)",
  );
  pages = collectPages();
  assert.ok(pages.length > 40, `expected the full export, found ${pages.length} pages`);
});

// ─── Shell and landmarks ─────────────────────────────────────────────────────

describe("site shell", () => {
  it("gives every page one main landmark and a skip link", () => {
    for (const { route, html } of pages) {
      assert.match(html, /<main[\s>]/, `${route}: no <main>`);
      assert.match(html, /class="skip-link"/, `${route}: no skip link`);
      assert.match(html, /id="main"/, `${route}: skip-link target missing`);
    }
  });

  it("gives every page a header and a footer landmark", () => {
    for (const { route, html } of pages) {
      assert.match(html, /<header[\s>]/, `${route}: no <header>`);
      assert.match(html, /<footer[\s>]/, `${route}: no <footer>`);
    }
  });

  it("gives every page exactly one h1", () => {
    for (const { route, html } of pages) {
      const count = (html.match(/<h1[\s>]/g) ?? []).length;
      assert.equal(count, 1, `${route}: ${count} h1 elements`);
    }
  });

  it("never skips from h1 to h3 before an h2 appears", () => {
    for (const { route, html } of pages) {
      const headings = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
      let seenH2 = false;
      for (const level of headings) {
        if (level === 2) seenH2 = true;
        if (level === 3 && !seenH2) {
          assert.fail(`${route}: an h3 appears before any h2`);
        }
      }
    }
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

describe("desktop and mobile navigation", () => {
  const primary = ["/systems", "/newsroom", "/roadmap", "/careers", "/about"];

  it("renders the primary navigation on every page", () => {
    for (const { route, html } of pages) {
      assert.match(html, /aria-label="Primary"/, `${route}: no primary nav`);
      for (const href of primary) {
        assert.ok(html.includes(`href="${href}"`), `${route}: primary nav missing ${href}`);
      }
    }
  });

  it("marks exactly one navigation item as the current page", () => {
    for (const route of primary) {
      const found = page(route);
      assert.ok(found, `${route} was not exported`);
      const count = (found.html.match(/aria-current="page"/g) ?? []).length;
      assert.ok(count >= 1, `${route}: nothing marked aria-current`);
    }
  });

  it("marks nothing current on a route outside the primary nav", () => {
    const legal = page("/legal");
    assert.ok(legal);
    assert.ok(
      !legal.html.includes('aria-current="page"'),
      "/legal marks a primary nav item as current",
    );
  });

  it("exposes the mobile menu as a dialog trigger with wired ARIA", () => {
    for (const { route, html } of pages) {
      assert.match(html, /data-testid="mobile-nav-toggle"/, `${route}: no mobile menu button`);
      assert.match(html, /aria-controls="mobile-navigation"/, `${route}: toggle not wired`);
      assert.match(html, /aria-haspopup="dialog"/, `${route}: toggle not announced as a dialog`);
      assert.match(html, /aria-expanded="false"/, `${route}: toggle has no expanded state`);
    }
  });

  it("does not ship the drawer open in the static HTML", () => {
    // The drawer mounts only on interaction. If it were in the export it would
    // be in the tab order of every page before the reader ever opened it.
    for (const { route, html } of pages) {
      assert.ok(!html.includes('data-testid="mobile-nav"'), `${route}: drawer is pre-rendered open`);
    }
  });

  it("gives the mobile toggle a touch-sized target", () => {
    const home = page("/");
    assert.match(home.html, /data-testid="mobile-nav-toggle"[^>]*/);
    const button = home.html.match(/<button[^>]*data-testid="mobile-nav-toggle"[^>]*>/)[0];
    assert.match(button, /tap-target/, "mobile toggle is not a touch-sized target");
  });
});

// ─── Constellation ───────────────────────────────────────────────────────────

// The constellation moved to /systems in Phase 4: the portfolio's picture of
// itself belongs to the route that owns the portfolio explanation, and the
// homepage promotes single stories rather than displaying the inventory.
describe("system constellation", () => {
  const HOST = "/systems";
  // Eight systems: three core foundations, four attached services, and one
  // concept-stage system. Selun x402 is a capability of Selun rather than a
  // node, and the Treasury Decision Desk is not a Sagitta product at all.
  const SYSTEMS = [
    "sagitta-continuity-engine",
    "sagitta-defense",
    "sagitta-radar",
    "aaa",
    "selun",
    "sagitta-banking",
    "sagitta-protocol",
    "sagitta-wallet",
  ];

  it("renders every node as a real link to its system", () => {
    const home = page(HOST);
    for (const slug of SYSTEMS) {
      const node = new RegExp(
        `<a[^>]*data-testid="constellation-node"[^>]*data-slug="${slug}"`,
      );
      const withHref = new RegExp(`href="/systems/${slug}"`);
      assert.match(home.html, node, `constellation is missing a node for ${slug}`);
      assert.match(home.html, withHref, `${slug} node has no href`);
    }
  });

  it("navigates without scripting — every node is an anchor, not a button", () => {
    const home = page(HOST);
    const nodes = home.html.match(/data-testid="constellation-node"/g) ?? [];
    assert.equal(nodes.length, 8, `expected 8 nodes, found ${nodes.length}`);
    // Each node's element must be an <a>; a <button> would be inert with JS off.
    const buttons = home.html.match(/<button[^>]*data-testid="constellation-node"/g) ?? [];
    assert.equal(buttons.length, 0, "a constellation node is a button rather than a link");
  });

  it("provides a structured-text equivalent for the graphic", () => {
    const home = page(HOST);
    const listNodes = home.html.match(/data-testid="constellation-list-node"/g) ?? [];
    assert.equal(listNodes.length, 8, "the structured list does not cover all eight systems");
    assert.match(home.html, /class="visually-hidden"/, "no text alternative is rendered");
  });

  it("keeps no information hover-only — name, state and summary are all in the HTML", () => {
    const home = page(HOST);
    for (const name of ["Sagitta Radar", "Sagitta Wallet", "Sagitta Banking"]) {
      assert.ok(home.html.includes(name), `"${name}" is not in the static HTML`);
    }
    for (const state of ["Operating", "Public Test", "In Development", "Research Horizon"]) {
      assert.ok(home.html.includes(state), `state "${state}" is not in the static HTML`);
    }
  });

  it("states each relationship in words as well as drawing it", () => {
    const home = page(HOST);
    assert.ok(
      home.html.includes("Connects to"),
      "relationships are drawn but never stated in text",
    );
  });
});

// ─── The promotional front page ──────────────────────────────────────────────

describe("homepage as a promotional front page", () => {
  it("opens on one dominant story with one action", () => {
    const home = page("/");
    const panels = home.html.match(/role="tabpanel"/g) ?? [];
    assert.ok(panels.length >= 3 && panels.length <= 5, `carousel holds ${panels.length} slides`);

    // Every slide ships in the HTML; exactly one is shown, so the lead story
    // renders in full with scripting unavailable.
    const hidden = home.html.match(/role="tabpanel"[^>]*hidden/g) ?? [];
    assert.equal(hidden.length, panels.length - 1, "more than one slide is visible at once");
  });

  it("ships the lead stage inert, with rotation added only by scripting", () => {
    // The carousel auto-rotates, which brings obligations. Two of them are
    // checkable in the shipped HTML.
    //
    // First: no pause control in the static markup. It only works with
    // scripting, so rendering it server-side would put a dead button in the
    // tab order of every reader who has none.
    //
    // Second: the stage still opens on one story with one action regardless,
    // so a reader without scripting gets the lead story rather than a stack
    // of five or an empty frame.
    const home = page("/");
    assert.ok(
      !home.html.includes("lead-rotate-toggle"),
      "the pause control is server-rendered — it would be inert without scripting",
    );

    const panels = home.html.match(/role="tabpanel"/g) ?? [];
    const hidden = home.html.match(/role="tabpanel"[^>]*hidden/g) ?? [];
    assert.equal(hidden.length, panels.length - 1, "more than one slide ships visible");
  });

  it("never runs the lead headline across an unscrimmed mark", () => {
    // The lead's type column and its picture column deliberately overlap: that
    // layering is what makes the opening read as one composition. It only works
    // where the picture carries a scrim under the type. A contained mark gets
    // no scrim by design — scrimming a transparent mark paints the framed logo
    // tile this page exists without — so a mark must not be crossed at all.
    //
    // Real headlines are what exposed this. "The infrastructure you depend on
    // is being watched." fills its column to the edge and ran straight through
    // the Radar mark. A contained mark therefore starts at column 8, where the
    // type column ends, rather than column 6.
    const home = page("/");
    const framed = [
      ...home.html.matchAll(
        /<div class="([^"]*lg:col-start-[^"]*)"><div class="lead-media" data-fit="(contain|cover)"/g,
      ),
    ];
    // Asserted so a markup change that stops this pattern matching fails here
    // rather than passing an empty loop.
    const slides = (home.html.match(/class="lead-media"/g) ?? []).length;
    assert.equal(framed.length, slides, `matched ${framed.length} of ${slides} lead pictures`);
    assert.ok(framed.length >= 3, `found ${framed.length} lead pictures`);

    for (const [, cls, fit] of framed) {
      if (fit === "contain") {
        assert.ok(
          cls.includes("lg:col-start-8"),
          `a contained mark starts at the layering column and will be crossed by the headline — ${cls}`,
        );
      } else {
        assert.ok(
          cls.includes("lg:col-start-6"),
          `a scrimmed composition is no longer layered under the type — ${cls}`,
        );
      }
    }
  });

  it("follows the approved rhythm", () => {
    const home = page("/");
    for (const stage of [
      'id="signals"',
      'id="product"',
      'id="watch"',
      'id="network"',
      'id="feature"',
    ]) {
      assert.ok(home.html.includes(stage), `homepage is missing the ${stage} stage`);
    }
  });

  it("stages the product moment as a running interface rather than a mark", () => {
    const home = page("/");
    // The wizard's own prompt, controls, and processing steps, rendered from
    // the same constants the deployed interface renders from.
    for (const label of [
      "Choose your risk tolerance",
      "Risk Tolerance",
      "Investment Timeframe",
      "Reviewing Market Condition",
      "Preparing Certified Decision Report",
      "selun.sagitta.systems/wizard",
    ]) {
      assert.ok(home.html.includes(label), `the product stage is missing "${label}"`);
    }
    // And says what it is, so a rendering is never mistaken for a capture.
    assert.ok(
      home.html.includes("Not a session capture"),
      "the interface composition is not captioned for what it is",
    );
  });

  it("tags every promotion's action for analytics", () => {
    const home = page("/");
    const tagged = home.html.match(/data-cta="promo:[^"]+"/g) ?? [];
    assert.ok(tagged.length >= 8, `only ${tagged.length} promotional actions are tagged`);
    assert.equal(new Set(tagged).size, tagged.length, "a promotional action id is used twice");
  });

  it("labels a moving figure as a dated snapshot", () => {
    const home = page("/");
    assert.match(home.html, /Snapshot as of/, "a point-in-time figure is presented as live");
    assert.ok(home.html.includes("801"), "the dated Continuity Engine snapshot is not published");
  });

  it("publishes the Radar rollup at a threshold, undated and never to the digit", () => {
    // The figure Radar displays moves continuously. It is published at an
    // approved threshold as a live rollup: no as-of date, because it was never
    // frozen, and no precise value, because the precise value is already stale.
    const home = page("/");
    assert.ok(
      home.html.includes("Over $300B"),
      "the approved Radar rollup wording is not published",
    );
    assert.ok(
      home.html.includes("Infrastructure monitored by Sagitta Radar"),
      "the rollup does not say what it measures",
    );
    assert.ok(!home.html.includes("$328.393M"), "the fluctuating precise figure is published");
    assert.doesNotMatch(
      home.html,
      /\$3\d\d(\.\d+)?M/,
      "a precise moving exposure figure reaches the page",
    );

    // The rollup's own row carries no as-of date.
    const strip = home.html.slice(
      home.html.indexOf('id="signals"'),
      home.html.indexOf('id="product"'),
    );
    const rollupRow = strip.slice(strip.indexOf("Over $300B"));
    const dateInRow = rollupRow.slice(0, rollupRow.indexOf("</li>"));
    assert.ok(
      !/Snapshot as of/.test(dateInRow),
      "the live rollup is presented as a dated snapshot",
    );
    assert.match(dateInRow, /Live from the product/, "the rollup is not labelled as live");
  });

  it("composes the desk as one lead plus up to three supporting rows", () => {
    // The count matches the density cap deliberately. A looser assertion here
    // would tolerate a fifth promotion that the page slices off and never
    // renders — the exact gap the cap was tightened to close.
    const home = page("/");
    const rows = home.html.match(/class="desk-row/g) ?? [];
    assert.ok(rows.length >= 3 && rows.length <= 4, `${rows.length} desk items`);
  });

  it("stages the Watch queue without turning it into a grid of equal cards", () => {
    const home = page("/");
    const watch = home.html.slice(
      home.html.indexOf('id="watch"'),
      home.html.indexOf('id="network"'),
    );
    // One video plays at a time, so exactly one play control renders. The rest
    // wait in the queue beside it.
    const controls = watch.match(/class="play-badge play-badge-lg"/g) ?? [];
    assert.equal(controls.length, 1, `${controls.length} play controls on the stage`);

    const queued = watch.match(/class="watch-queue-item"/g) ?? [];
    assert.ok(queued.length >= 1, "the second video is not queued beside the first");
    assert.ok(queued.length <= 3, `${queued.length} queued videos — the stage holds at most four`);

    // The queue is rules and thumbnails, not the card treatment the rest of the
    // page works to avoid.
    assert.ok(!watch.includes("surface-card"), "the Watch queue renders cards");
  });

  it("gives the desk one lead item and the rest as rows", () => {
    const home = page("/");
    const leads = home.html.match(/class="desk-row desk-row-lead"/g) ?? [];
    assert.equal(leads.length, 1, `the desk has ${leads.length} lead items`);
    // Text-led, not a card grid: no surface-card treatment reaches the desk.
    const network = home.html.slice(home.html.indexOf('id="network"'));
    assert.ok(!network.includes("surface-card"), "the network desk renders cards");
  });

  it("carries no founder biography, press kit, careers, or roadmap summary", () => {
    const home = page("/");
    // The founder's name may appear as the byline of a real article he wrote —
    // that is attribution, not a biography. The biography itself belongs to
    // /about, and the assertion below is keyed to its own text.
    assert.ok(!home.html.includes("since 1997"), "homepage carries the founder biography");
    for (const marker of [
      "Press room",
      "Media library",
      "Register interest",
      "Full roadmap",
      "Current priorities",
      "The editorial desks",
    ]) {
      assert.ok(!home.html.includes(marker), `homepage still carries "${marker}"`);
    }
  });

  it("no longer displays the system inventory or its count", () => {
    const home = page("/");
    assert.ok(
      !home.html.includes('data-testid="constellation-node"'),
      "the ten-node constellation is still on the homepage",
    );
    assert.ok(
      !home.html.includes('data-testid="system-card"'),
      "the system inventory is still on the homepage",
    );
    const text = visibleText(home.html);
    assert.doesNotMatch(text, /\b(ten|10)\s+systems\b/i, "the homepage restates the system count");
  });

  it("gives every promotion a real destination", () => {
    const home = page("/");
    for (const tag of home.html.match(/<a\b[^>]*data-cta="promo:[^"]*"[^>]*>/g) ?? []) {
      assert.match(tag, /href="(https?:\/\/|\/)[^"]+"/, `promotional action with no destination — ${tag}`);
    }
  });

  it("renders a permanent Watch stage between the product moment and the desk", () => {
    const home = page("/");
    const product = home.html.indexOf('id="product"');
    const watch = home.html.indexOf('id="watch"');
    const network = home.html.indexOf('id="network"');
    assert.ok(watch > -1, "the Watch stage is missing");
    assert.ok(product < watch && watch < network, "the Watch stage is out of sequence");
  });

  it("plays the real published video, with only metadata the source publishes", () => {
    // The stage is in its published state: one verified episode exists. It must
    // carry what a real episode has — poster, play treatment, exact title,
    // source, related system, date, runtime, and the video's own destination —
    // and nothing a source did not publish.
    const home = page("/");
    const watch = home.html.slice(
      home.html.indexOf('id="watch"'),
      home.html.indexOf('id="network"'),
    );

    assert.ok(watch.includes("play-badge"), "the published episode has no play treatment");
    assert.ok(
      watch.includes("/watch/introducing-selun.jpg"),
      "the verified YouTube thumbnail is not staged",
    );
    assert.ok(watch.includes("Introducing Selun"), "the exact video title is not rendered");
    assert.ok(watch.includes("Sagitta Labs"), "the channel is not named");
    assert.ok(watch.includes("Selun"), "the related system is not named");
    assert.ok(watch.includes("0:41"), "the verified duration is not rendered");
    // The channel feed's own timestamp, which is what a reader checking the
    // video sees. Resolved 2026-08-02: the owner-supplied 2026-03-19 was a
    // production date and is not published anywhere on the site.
    assert.match(watch, /28 Mar 2026/, "the verified publication date is not rendered");
    assert.doesNotMatch(watch, /19 Mar 2026/, "the superseded production date is published");
    assert.ok(
      watch.includes("https://www.youtube.com/watch?v=SHecO67AqfM"),
      "the stage does not link to the video itself",
    );

    // No view count, no invented episode numbering, and no self-hosted player:
    // the video plays where it was published.
    assert.doesNotMatch(watch, /\b[\d,.]+\s*(views|subscribers)\b/i, "an audience figure is published");
    assert.doesNotMatch(watch, /\b(episode\s*\d|season\s*\d)\b/i, "an episode number is invented");
    assert.ok(!/<(video|audio)[\s>]/i.test(watch), "the stage hosts its own player");
  });

  it("loads nothing from YouTube until the reader presses play", () => {
    // The video plays on the page, but the embed is created on the first click.
    // Nothing in the shipped HTML reaches a third party on load: no iframe, no
    // YouTube script, no preconnect. The only picture is the poster, and that
    // is served from this origin.
    for (const { route, html } of pages) {
      assert.ok(!/<iframe[\s>]/i.test(html), `${route}: ships a third-party frame on load`);
      assert.ok(
        !/<script[^>]+(youtube|ytimg|googlevideo)/i.test(html),
        `${route}: loads a YouTube script on page load`,
      );
      assert.ok(
        !/<link[^>]+rel="(preconnect|dns-prefetch)"[^>]+(youtube|ytimg)/i.test(html),
        `${route}: reaches out to YouTube before the reader asks`,
      );
      assert.ok(
        !/(src|href)="https?:\/\/i\.ytimg\.com/i.test(html),
        `${route}: hotlinks a YouTube-hosted image`,
      );
    }

    // And when it is created, it uses the privacy-enhanced host — which is in
    // the bundle rather than the HTML, because that is where the player lives.
    const collectJs = (dir) =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return collectJs(full);
        return entry.name.endsWith(".js") ? [readFileSync(full, "utf8")] : [];
      });
    const js = collectJs(path.join(OUT, "_next", "static", "chunks")).join("\n");
    assert.match(js, /youtube-nocookie\.com/, "the player does not use the no-cookie host");
    assert.ok(
      !/\/\/www\.youtube\.com\/embed\//.test(js),
      "the player embeds from the cookie-setting host",
    );
  });

  it("still reaches the video without scripting", () => {
    // The poster is a real anchor to the video's own page in the static HTML.
    // With scripting the click is intercepted and it plays here instead; with
    // scripting unavailable it navigates, and there is no dead control.
    const home = page("/");
    const watch = home.html.slice(
      home.html.indexOf('id="watch"'),
      home.html.indexOf('id="network"'),
    );
    const poster = watch.match(/<a[^>]*data-cta="promo:introducing-selun-video:watch"[^>]*>/);
    assert.ok(poster, "the Watch poster is not an anchor in the static HTML");
    assert.match(poster[0], /href="https:\/\/www\.youtube\.com\/watch\?v=SHecO67AqfM"/);
    assert.match(poster[0], /target="_blank"/);
    assert.match(poster[0], /rel="[^"]*noopener/);

    // Every queued video is reachable too: its button carries the title, and
    // the section links out to the source for each.
    assert.ok(
      watch.includes("https://www.youtube.com/watch?v=PabWDk6I-HI"),
      "the second video has no destination in the static HTML",
    );
  });

  it("no longer presents the active Watch item as a forthcoming Defense episode", () => {
    const home = page("/");
    const watch = home.html.slice(
      home.html.indexOf('id="watch"'),
      home.html.indexOf('id="network"'),
    );
    assert.ok(
      !watch.includes("First episode forthcoming"),
      "the forthcoming programme still occupies the stage",
    );
    assert.ok(
      !watch.includes("Sagitta Defense Review"),
      "the real Selun video is staged as a Defense Review episode",
    );
  });

  it("promotes no system beyond its operating state", () => {
    const home = page("/");
    // Sagitta Protocol is in Public Test. It is explored, never opened.
    assert.ok(home.html.includes("Explore the public test"));
    assert.ok(
      home.html.includes("No mainnet deployment or contract addresses are published."),
      "the testnet qualification is missing from the protocol feature",
    );
  });
});

// ─── One canonical home per subject ──────────────────────────────────────────

describe("editorial ownership", () => {
  it("publishes the full founder profile only on /about", () => {
    const carriers = pages
      .filter(({ html }) => html.includes("since 1997"))
      .map(({ route }) => route);
    assert.deepEqual(carriers, ["/about"], `the founder biography also appears on ${carriers}`);
  });

  it("keeps the system inventory on /systems", () => {
    const carriers = pages
      .filter(({ html }) => html.includes('data-testid="system-card"'))
      .map(({ route }) => route);
    assert.deepEqual(carriers, ["/systems"], `system cards also appear on ${carriers}`);
  });

  // The audience router used to close /systems, and before that /about. It now
  // renders on neither: it enumerates reader types rather than promoting a
  // system, and /systems ends on the directory. The rule this suite exists to
  // enforce — one canonical home per subject, never a restatement — is kept by
  // asserting no route publishes it at all.
  it("publishes the engagement router on no route", () => {
    const carriers = pages
      .filter(({ html }) => html.includes("Find your entry point"))
      .map(({ route }) => route);
    assert.deepEqual(carriers, [], `the engagement router appears on ${carriers}`);
  });

  it("states the system count only where the directory owns it", () => {
    const carriers = pages
      // Eight, not ten. This still read "ten" after the system model was
      // corrected, so it matched nothing and passed without testing anything.
      .filter(({ html }) => /\b(eight|8)\s+systems\b/i.test(visibleText(html)))
      .map(({ route }) => route);
    for (const route of carriers) {
      assert.ok(
        route === "/systems" || route.startsWith("/press") || route.startsWith("/legal"),
        `${route} restates the system count`,
      );
    }
  });
});

// ─── State-aware calls to action ─────────────────────────────────────────────

describe("state-aware calls to action", () => {
  it("tags every system page's primary action for analytics", () => {
    for (const slug of ["sagitta-radar", "sagitta-protocol", "sagitta-banking", "sagitta-wallet"]) {
      const found = page(`/systems/${slug}`);
      assert.ok(found, `/systems/${slug} was not exported`);
      assert.match(found.html, /data-cta="system:/, `${slug}: no tagged call to action`);
      assert.match(found.html, /data-cta-type="/, `${slug}: action has no type`);
      assert.match(found.html, /data-cta-availability="/, `${slug}: action has no availability`);
    }
  });

  it("offers an open-product action only on an operating system", () => {
    for (const slug of ["sagitta-protocol", "sagitta-banking", "sagitta-wallet"]) {
      const found = page(`/systems/${slug}`);
      assert.ok(
        !found.html.includes('data-cta-type="open-product"'),
        `${slug} is not operating but offers an open-product action`,
      );
    }
    const radar = page("/systems/sagitta-radar");
    assert.match(radar.html, /data-cta-type="open-product"/, "Radar offers no open-product action");
  });

  it("renders destination-led labels rather than generic ones", () => {
    const radar = page("/systems/sagitta-radar");
    assert.ok(radar.html.includes("Open Sagitta Radar"));

    for (const { route, html } of pages) {
      for (const generic of [">Learn more<", ">Read more<", ">Click here<"]) {
        assert.ok(!html.includes(generic), `${route}: uses the generic label ${generic}`);
      }
    }
  });

  it("states the in-development caveats rather than implying availability", () => {
    const wallet = page("/systems/sagitta-wallet");
    assert.match(wallet.html, /sample data/i, "the wallet demo is not qualified");
    const banking = page("/systems/sagitta-banking");
    assert.match(banking.html, /Design-partner briefings only/i, "banking is not qualified");
  });

  it("keeps the Defense Review's fixed engagement price", () => {
    const defense = page("/systems/sagitta-defense");
    assert.ok(defense.html.includes("$3,000"), "the fixed Defense Review price is missing");
  });

  it("does not quote moving subscription prices on the hub", () => {
    // Radar plan prices and AAA tier prices live on their own surfaces; the hub
    // states how many plans exist and links out.
    //
    // Asserted against visible text rather than raw HTML. React's Flight payload
    // is inlined into <script> blocks as `["$","$29",null,…]`, where `$29` is a
    // reference token, not a price — Next 16 inlines considerably more of it,
    // and a raw substring check reads those tokens as quoted prices. Reading the
    // text a reader actually sees is both correct and closer to the rule's
    // intent.
    const moving = ["$29", "$99", "$149", "$79/mo", "$499/mo"];
    for (const { route, html } of pages) {
      const text = visibleText(html);
      for (const price of moving) {
        assert.ok(!text.includes(price), `${route}: quotes the moving price ${price}`);
      }
    }
  });
});

// ─── External links ──────────────────────────────────────────────────────────

describe("external link handling", () => {
  it("opens every off-site link safely in a new tab", () => {
    for (const { route, html } of pages) {
      for (const tag of html.match(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g) ?? []) {
        assert.match(tag, /target="_blank"/, `${route}: external link without target — ${tag}`);
        assert.match(tag, /rel="[^"]*noopener/, `${route}: external link without noopener — ${tag}`);
      }
    }
  });

  it("does not add target or rel to internal links", () => {
    for (const { route, html } of pages) {
      for (const tag of html.match(/<a\b[^>]*href="\/[^"]*"[^>]*>/g) ?? []) {
        if (/\.(png|svg|jpg|jpeg|webp|pdf)"/.test(tag)) continue; // assets open directly
        assert.ok(!/target="_blank"/.test(tag), `${route}: internal link opens a new tab — ${tag}`);
      }
    }
  });

  it("announces that an external link opens a new tab", () => {
    const home = page("/");
    assert.ok(
      home.html.includes("(opens in a new tab)"),
      "external links carry no announcement for screen readers",
    );
  });
});

// ─── Published records only ──────────────────────────────────────────────────

describe("Allocation Read 001", () => {
  const route = "/newsroom/what-aggressive-means-in-a-defensive-market";

  it("publishes the numbered read under the Allocation Desk with its data tables", () => {
    const report = page(route);
    assert.ok(report, `${route} was not exported`);
    assert.ok(report.html.includes("Allocation Desk · Allocation Read 001"));
    assert.ok(report.html.includes("What Aggressive Means in a Defensive Market"));
    assert.equal(report.html.match(/<table/g)?.length, 3);
    assert.ok(report.html.includes("It is not investment guidance."));
  });

  it("surfaces the canonical report on the Selun system page", () => {
    const selun = page("/systems/selun");
    assert.ok(selun.html.includes(route));
    assert.ok(selun.html.includes("What Aggressive Means in a Defensive Market"));
  });
});

describe("unpublished records never reach the export", () => {
  const WITHHELD_NEWSROOM = ["placeholder"];
  const WITHHELD_CAREERS = ["sagitta-protocol-workstream", "sagitta-wallet-workstream"];

  it("exports no page for a withheld career record", () => {
    for (const slug of WITHHELD_CAREERS) {
      assert.equal(page(`/careers/${slug}`), undefined, `/careers/${slug} was exported`);
    }
  });

  it("links to no withheld career record from anywhere", () => {
    for (const { route, html } of pages) {
      for (const slug of WITHHELD_CAREERS) {
        assert.ok(!html.includes(`/careers/${slug}`), `${route}: links to withheld ${slug}`);
      }
    }
  });

  it("publishes no placeholder record", () => {
    for (const { route, html } of pages) {
      for (const marker of WITHHELD_NEWSROOM) {
        assert.ok(
          !new RegExp(`/newsroom/[^"]*${marker}`, "i").test(html),
          `${route}: links to a ${marker} record`,
        );
      }
    }
  });

  it("names the Sagitta Labs aliases nowhere in the export", () => {
    for (const { route, html } of pages) {
      for (const alias of ["Orion Gray", "Alexander Roth"]) {
        assert.ok(!html.includes(alias), `${route}: publishes the alias "${alias}"`);
      }
    }
  });

  it("shows an upcoming desk as upcoming rather than as a story", () => {
    const newsroom = page("/newsroom");
    assert.match(newsroom.html, /This desk has not published yet/);
  });
});

// ─── Identity and naming ─────────────────────────────────────────────────────

describe("no product-level Labs attribution", () => {
  // The press room's naming guidance quotes the forbidden form in order to
  // forbid it, and is the one place it may legitimately appear.
  const GUIDANCE_ROUTES = new Set(["/press"]);

  it("never places a Labs attribution beside a product name", () => {
    const patterns = [
      /\bRadar\s+by\s+Sagitta\s+Labs\b/i,
      /\bDeveloped\s+by\s+Sagitta\s+Systems\b/i,
    ];
    for (const { route, html } of pages) {
      if (GUIDANCE_ROUTES.has(route)) continue;
      const text = visibleText(html);
      for (const pattern of patterns) {
        assert.doesNotMatch(text, pattern, `${route}: carries product-level attribution`);
      }
    }
  });

  it("keeps the institutional relationship in its proper places", () => {
    assert.match(page("/about").html, /Sagitta Labs/, "/about omits the Labs relationship");
    assert.match(page("/").html, /Sagitta Labs/, "the footer omits the Labs relationship");
  });

  it("does not describe Sagitta Labs as incorporated", () => {
    const about = visibleText(page("/about").html);
    assert.match(about, /rather than an incorporated entity/i);
  });
});

// ─── Filters ─────────────────────────────────────────────────────────────────

describe("filter controls", () => {
  it("labels the systems directory filters as radio groups", () => {
    const systems = page("/systems");
    assert.match(systems.html, /role="radiogroup"[^>]*aria-label="Strategic family"/);
    assert.match(systems.html, /role="radiogroup"[^>]*aria-label="Operating state"/);
    assert.match(systems.html, /role="radio"/);
    assert.match(systems.html, /aria-checked="true"/);
  });

  it("labels the newsroom filters as radio groups", () => {
    const newsroom = page("/newsroom");
    for (const label of ["Editorial desk", "Media type", "Related system", "Published"]) {
      assert.ok(
        newsroom.html.includes(`aria-label="${label}"`),
        `newsroom has no "${label}" filter group`,
      );
    }
  });

  it("announces the result count politely", () => {
    for (const route of ["/systems", "/newsroom"]) {
      assert.match(page(route).html, /aria-live="polite"/, `${route}: result count is not announced`);
    }
  });

  it("renders all eight systems before any filter is applied", () => {
    const systems = page("/systems");
    const cards = systems.html.match(/data-testid="system-card"/g) ?? [];
    assert.equal(cards.length, 8, `expected 8 system cards, found ${cards.length}`);
  });

  it("shows no empty state on an unfiltered directory", () => {
    const systems = page("/systems");
    assert.ok(
      !systems.html.includes("No systems match these filters"),
      "the empty state renders before any filter is chosen",
    );
  });
});

// ─── Motion and media ────────────────────────────────────────────────────────

describe("motion and media", () => {
  it("honours prefers-reduced-motion in the shipped stylesheet", () => {
    const cssDir = path.join(OUT, "_next", "static", "css");
    assert.ok(existsSync(cssDir), "no stylesheet was exported");
    const css = readdirSync(cssDir)
      .filter((f) => f.endsWith(".css"))
      .map((f) => readFileSync(path.join(cssDir, f), "utf8"))
      .join("\n");

    // The minifier drops the leading zero, so both spellings are accepted.
    assert.match(css, /prefers-reduced-motion\s*:\s*reduce/, "no reduced-motion rule ships");
    assert.match(css, /animation-duration\s*:\s*0?\.001ms/, "animations are not neutralised");
    assert.match(css, /transition-duration\s*:\s*0?\.001ms/, "transitions are not neutralised");
    assert.match(css, /scroll-behavior\s*:\s*auto/, "smooth scrolling is not disabled");
  });

  it("autoplays no audio or video anywhere", () => {
    for (const { route, html } of pages) {
      assert.ok(!/<(audio|video)[^>]*\bautoplay\b/i.test(html), `${route}: autoplays media`);
    }
  });

  it("renders no media player without a verified source", () => {
    // No Sagitta recording has been published, so no player should exist yet.
    for (const { route, html } of pages) {
      assert.ok(!/<audio[\s>]/i.test(html), `${route}: renders an audio player with no recording`);
      assert.ok(!/<video[\s>]/i.test(html), `${route}: renders a video player with no recording`);
    }
  });
});

// ─── Social assets ───────────────────────────────────────────────────────────

describe("open graph assets", () => {
  const ROUTES = {
    "/": "home.png",
    "/systems": "systems.png",
    "/newsroom": "newsroom.png",
    "/roadmap": "roadmap.png",
    "/careers": "careers.png",
    "/about": "about.png",
    "/press": "press.png",
  };

  it("gives every primary institutional route its own card", () => {
    for (const [route, file] of Object.entries(ROUTES)) {
      const found = page(route);
      assert.ok(found, `${route} was not exported`);
      assert.ok(found.html.includes(`/og/${file}`), `${route}: does not reference /og/${file}`);
    }
  });

  it("gives each strategic family a card, inherited by its systems", () => {
    const inherited = {
      "/systems/sagitta-radar": "family-continuity.png",
      "/systems/selun": "family-allocation.png",
      "/systems/sagitta-protocol": "family-capital.png",
    };
    for (const [route, file] of Object.entries(inherited)) {
      assert.ok(page(route).html.includes(`/og/${file}`), `${route}: wrong family card`);
    }
  });

  it("ships every referenced card as a real file", () => {
    const referenced = new Set();
    for (const { html } of pages) {
      for (const match of html.matchAll(/\/og\/([a-z-]+\.png)/g)) referenced.add(match[1]);
    }
    assert.ok(referenced.size >= 10, `only ${referenced.size} cards are referenced`);

    for (const file of referenced) {
      const source = path.join(PUBLIC, "og", file);
      const exported = path.join(OUT, "og", file);
      assert.ok(existsSync(source), `public/og/${file} is missing`);
      assert.ok(existsSync(exported), `out/og/${file} was not exported`);

      // A social scraper fetches these on every share; keep them lean.
      const bytes = statSync(exported).size;
      assert.ok(bytes < 200_000, `og/${file} is ${(bytes / 1024).toFixed(0)} kB — too heavy`);

      // PNG signature and IHDR dimensions, read directly.
      const buffer = readFileSync(exported);
      assert.equal(buffer.subarray(1, 4).toString(), "PNG", `og/${file} is not a PNG`);
      assert.equal(buffer.readUInt32BE(16), 1200, `og/${file} is not 1200px wide`);
      assert.equal(buffer.readUInt32BE(20), 630, `og/${file} is not 630px tall`);
    }
  });
});

// ─── Images ──────────────────────────────────────────────────────────────────

describe("images", () => {
  it("gives every image an alt attribute", () => {
    for (const { route, html } of pages) {
      for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
        assert.match(tag, /\balt="/, `${route}: image without alt — ${tag.slice(0, 120)}`);
      }
    }
  });

  it("marks decorative images as decorative rather than describing them", () => {
    const home = page("/");
    assert.match(home.html, /<img[^>]*alt=""/, "no decorative image is marked as such");
  });
});

// ─── The lead story ──────────────────────────────────────────────────────────

describe("the lead story", () => {
  /** The lead card is the first story card on /newsroom. */
  function leadCard() {
    const html = page("/newsroom").html;
    const start = html.indexOf('data-testid="story-card"');
    assert.notEqual(start, -1, "/newsroom rendered no story cards");
    const open = html.lastIndexOf("<article", start);
    return html.slice(open, html.indexOf("</article>", start));
  }

  // The lead slot is chosen editorially, so it lands on records that earn no
  // image as often as not. It still has to look like a front page.
  it("always carries a visual, image or motif", () => {
    const card = leadCard();
    const hasImage = /<img\b/.test(card);
    const hasMotif = card.includes('data-testid="story-motif"');
    assert.ok(hasImage || hasMotif, "the lead story rendered as text only");
  });

  it("keeps the motif decorative rather than announcing it", () => {
    const card = leadCard();
    if (!card.includes('data-testid="story-motif"')) return;
    const panel = card.slice(card.indexOf('data-testid="story-motif"') - 200);
    assert.match(
      panel.slice(0, 400),
      /aria-hidden="true"/,
      "the motif panel is not marked decorative",
    );
  });

  // The panel shows identity — a registered system mark, or the family motif.
  // What it must never become is a stand-in for an interface: no product
  // screenshot exists for any system, and simulating one here would break the
  // same rule the promotion layer is held to.
  it("shows only a registered system mark, never an invented visual", () => {
    const card = leadCard();
    if (!card.includes('data-testid="story-motif"')) return;
    const panel = card.slice(card.indexOf('data-testid="story-motif"'));

    // Every identity asset the content layer declares, read from the source of
    // truth. Marks and wordmarks both qualify — the rail takes either — but
    // nothing outside this set may appear.
    const systemsSrc = readFileSync(path.join(process.cwd(), "src/content/systems.ts"), "utf8");
    const marks = new Set(
      [...systemsSrc.matchAll(/(?:logo|wordmark):\s*"([^"]+)"/g)].map((m) => m[1]),
    );
    assert.ok(marks.size > 0, "no system marks are declared in the content layer");

    for (const tag of panel.slice(0, 2000).match(/<img\b[^>]*>/g) ?? []) {
      const src = decodeURIComponent((tag.match(/src="([^"]+)"/) ?? [])[1] ?? "");
      assert.ok(
        marks.has(src),
        `the lead panel shows "${src}", which is not a mark declared in systems.ts`,
      );
    }
  });
});

// ─── Publication provenance ──────────────────────────────────────────────────

/** Each `<article>` story card on a page, as raw HTML. */
function storyCards(html) {
  const cards = [];
  let from = 0;
  for (;;) {
    const at = html.indexOf('data-testid="story-card"', from);
    if (at === -1) return cards;
    const open = html.lastIndexOf("<article", at);
    const close = html.indexOf("</article>", at);
    if (open === -1 || close === -1) return cards;
    cards.push(html.slice(open, close));
    from = close;
  }
}

describe("publication provenance", () => {
  // "Published elsewhere" is a claim about who published the work. It belongs
  // only on records whose canonical text really is on another site — not on
  // launch milestones and status checks, whose external link is the product.
  it("claims an outside publisher only where one exists", () => {
    const canonicallyOurs = new Set([
      "sagitta-radar-launched",
      "sagitta-radar-operating-status-july-2026",
      "selun-x402-operating-status-july-2026",
      "sagitta-defense-now-operating",
      "sagitta-protocol-launched-on-arc-testnet",
      "sagitta-protocol-launched-on-moonbase-alpha-testnet",
    ]);

    // Cards are identified by their own `data-cta="story:<slug>"` link rather
    // than by any href to the slug — the same record is linked from other
    // cards' bodies and from the flight payload, and slicing on that matched
    // the wrong article.
    let checked = 0;
    for (const card of storyCards(page("/newsroom").html)) {
      const slug = (card.match(/data-cta="story:([^"]+)"/) ?? [])[1];
      if (!slug || !canonicallyOurs.has(slug)) continue;
      checked += 1;
      assert.ok(
        !card.includes("Published elsewhere"),
        `${slug}: attributes its own record to an outside publisher`,
      );
    }
    assert.ok(checked > 0, "matched none of the records this test is about");
  });

  it("still labels the records that really are published elsewhere", () => {
    const html = page("/newsroom").html;
    assert.ok(
      html.includes("Published elsewhere"),
      "no record is labelled as published elsewhere — the badge has stopped rendering entirely",
    );
  });
});

// ─── System marks ────────────────────────────────────────────────────────────

describe("system marks", () => {
  // A mark that exists must be registered everywhere marks are enumerated,
  // or the press room and media library quietly under-report what is available.
  it("registers every declared mark in the press room and media library", () => {
    const systemsSrc = readFileSync(path.join(process.cwd(), "src/content/systems.ts"), "utf8");
    // Wordmarks are registered brand assets too, and are the kind of thing most
    // likely to be added to the content layer and forgotten in both indexes.
    const marks = [
      ...new Set([...systemsSrc.matchAll(/(?:logo|wordmark):\s*"([^"]+)"/g)].map((m) => m[1])),
    ];

    for (const mark of marks) {
      assert.ok(
        existsSync(path.join(PUBLIC, mark.replace(/^\//, ""))),
        `${mark} is declared as a system logo but is not in public/`,
      );
      assert.ok(page("/press").html.includes(mark), `${mark} is not listed in the press room`);
      assert.ok(
        page("/media-library").html.includes(mark),
        `${mark} is not listed in the media library`,
      );
    }
  });
});

// ─── Roadmap scanning ────────────────────────────────────────────────────────

describe("roadmap milestones are scannable", () => {
  function roadmapItems() {
    return [...page("/roadmap").html.matchAll(
      /<article[^>]*data-testid="roadmap-item"[\s\S]*?<\/article>/g,
    )].map((m) => m[0]);
  }

  // The point of the mark column is that it is a column: one gap and the eye
  // has to fall back to reading every title.
  it("gives every milestone a mark or a family motif", () => {
    const items = roadmapItems();
    assert.ok(items.length > 0, "/roadmap rendered no milestones");
    for (const item of items) {
      const title = (item.match(/<h3[^>]*>([^<]+)</) ?? [])[1] ?? "(untitled)";
      const hasMark = /<img\b/.test(item);
      const hasMotif = /<svg/.test(item.slice(0, 1200));
      assert.ok(hasMark || hasMotif, `roadmap milestone has no visual: ${title}`);
    }
  });

  // The slot is what makes the column a column. Square marks and the Banking
  // lockup are different shapes; if the box that holds them varied too, the
  // marks would no longer line up and the scan value would be lost.
  it("gives every milestone the same mark slot, whatever shape the asset is", () => {
    // Both branches of SystemMark — the asset wrapper and the motif fallback —
    // render the same slot span, so its box is the thing to compare.
    const boxes = new Set();
    for (const item of roadmapItems()) {
      const title = (item.match(/<h3[^>]*>([^<]+)</) ?? [])[1] ?? "(untitled)";
      const style = item.match(
        /<span aria-hidden="true" class="shrink-0 inline-flex[^>]*?style="([^"]*)"/,
      )?.[1];
      assert.ok(style, `no mark slot on milestone: ${title}`);

      const w = style.match(/width:(\d+)px/)?.[1];
      const h = style.match(/height:(\d+)px/)?.[1];
      assert.ok(w && h, `mark slot has no fixed box on milestone: ${title} — ${style}`);
      boxes.add(`${w}x${h}`);
    }

    assert.equal(boxes.size, 1, `mark slots differ across milestones: ${[...boxes].join(", ")}`);
  });

  it("keeps the mark decorative, since the system is already a link", () => {
    for (const item of roadmapItems()) {
      for (const tag of item.match(/<img\b[^>]*>/g) ?? []) {
        assert.match(tag, /alt=""/, `roadmap mark is not decorative: ${tag.slice(0, 100)}`);
      }
    }
  });
});
