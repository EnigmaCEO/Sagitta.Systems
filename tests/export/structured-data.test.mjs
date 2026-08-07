// Structured data, asserted against the real static export.
//
// Structured data is the one part of the site a reader never sees and a crawler
// treats as authoritative, which is exactly the combination that lets it drift
// from the truth unnoticed. These tests hold it to the same rule as the visible
// copy: every claim traceable to the content layer, nothing asserted that the
// audit has not cleared, and nothing invented to fill a required property.
//
// Run: npm run test:export   (or `npm run verify`, which sequences it)

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { before, describe, it } from "node:test";

const OUT = path.join(process.cwd(), "out");

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

/** Every ld+json block on a page, parsed. */
function blocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) =>
    JSON.parse(m[1].replace(/\\u003c/g, "<")),
  );
}

let pages = [];
const page = (route) => pages.find((p) => p.route === route);

before(() => {
  pages = collectPages();
  assert.ok(pages.length > 0, "no exported pages found — run `npm run build` first");
});

describe("structured data", () => {
  it("parses as JSON on every page that emits it", () => {
    for (const { route, html } of pages) {
      assert.doesNotThrow(() => blocks(html), `${route}: unparseable ld+json`);
    }
  });

  it("puts the organization and website identity on every page", () => {
    for (const { route, html } of pages) {
      const types = blocks(html).map((b) => b["@type"]);
      assert.ok(types.includes("Organization"), `${route}: no Organization node`);
      assert.ok(types.includes("WebSite"), `${route}: no WebSite node`);
    }
  });

  it("never closes the script tag from inside a value", () => {
    for (const { route, html } of pages) {
      for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
        assert.ok(!m[1].includes("<"), `${route}: unescaped "<" inside ld+json`);
      }
    }
  });

  // The identity rules the content audit enforces in prose apply here too — a
  // machine-readable claim is still a claim.
  it("does not describe Sagitta Labs as a parent entity", () => {
    for (const { route, html } of pages) {
      for (const block of blocks(html)) {
        const json = JSON.stringify(block);
        assert.ok(!/parentOrganization/.test(json), `${route}: asserts a parentOrganization`);
        assert.ok(
          !/"sameAs":\[[^\]]*youtube/i.test(json),
          `${route}: lists the Sagitta Labs YouTube channel as Sagitta Systems' own`,
        );
      }
    }
  });

  it("advertises only the active role as a job posting", () => {
    const postings = pages.flatMap(({ route, html }) =>
      blocks(html)
        .filter((block) => block["@type"] === "JobPosting")
        .map((block) => ({ route, block })),
    );
    assert.equal(postings.length, 1, "expected exactly one active JobPosting");
    assert.equal(postings[0].route, "/careers/sales-engine-operator");
    assert.equal(postings[0].block.jobLocationType, "TELECOMMUTE");
    assert.equal(postings[0].block.hiringOrganization["@id"], "https://www.sagitta.systems/#organization");
  });

  it("names one person, on /about, and it is the one public profile", () => {
    const people = pages.flatMap(({ route, html }) =>
      blocks(html)
        .filter((b) => b["@type"] === "Person")
        .map((b) => ({ route, name: b.name })),
    );
    assert.equal(people.length, 1, "expected exactly one Person node across the export");
    assert.equal(people[0].route, "/about");
    assert.equal(people[0].name, "Xavier D. Moore");
  });

  it("claims an Article only where this site is the canonical", () => {
    const articles = pages.flatMap(({ route, html }) =>
      blocks(html)
        .filter((b) => b["@type"] === "Article")
        .map((b) => ({ route, block: b })),
    );
    assert.ok(articles.length > 0, "no Article markup was emitted at all");

    for (const { route, block } of articles) {
      assert.ok(route.startsWith("/newsroom/"), `${route}: Article outside the newsroom`);
      // The canonical must be this page, never a third-party publisher.
      assert.equal(
        block.mainEntityOfPage["@id"],
        `https://www.sagitta.systems${route}`,
        `${route}: Article canonical does not point at its own page`,
      );
      // Never invent the property a crawler leans on hardest.
      assert.match(block.datePublished, /^\d{4}-\d{2}-\d{2}$/, `${route}: bad datePublished`);
    }
  });

  it("emits no Article on a record whose full text is published elsewhere", () => {
    // Off-network canonicals: Paragraph, LinkedIn, and YouTube. Each of these
    // records carries a full treatment of its subject, but the work itself is
    // published and owned on another surface, so claiming an Article here would
    // compete with the real publication.
    //
    // The four AAA research notes used to be on this list and are deliberately
    // no longer — see the repatriation test below.
    const elsewhere = [
      "/newsroom/the-three-deaths-doctrine",
      "/newsroom/risk-policy-is-only-real-when-it-constrains-the-decision",
      "/newsroom/introducing-selun",
    ];
    for (const route of elsewhere) {
      const target = page(route);
      assert.ok(target, `${route} was not exported`);
      const types = blocks(target.html).map((b) => b["@type"]);
      assert.ok(!types.includes("Article"), `${route}: claims an Article it does not own`);
    }
  });

  it("owns the Article on a repatriated AAA research note", () => {
    // Repatriated 2026-08-02. Both surfaces are Sagitta's, the full argument is
    // now published here, and this hub record is the canonical one — so the
    // Article belongs to this page. The AAA research-notes surface is recorded
    // as a reference to the same note rather than as the canonical publication.
    const repatriated = [
      "/newsroom/scenario-governance-in-on-chain-markets",
      "/newsroom/designing-enforceable-allocation-policy",
      "/newsroom/authority-gated-decision-intelligence",
      "/newsroom/determinism-discretion-and-trust",
    ];
    for (const route of repatriated) {
      const target = page(route);
      assert.ok(target, `${route} was not exported`);
      const article = blocks(target.html).find((b) => b["@type"] === "Article");
      assert.ok(article, `${route}: repatriated note does not claim its own Article`);
      assert.ok(
        article.mainEntityOfPage["@id"].endsWith(route),
        `${route}: Article canonical does not point at its own page`,
      );
      // The publication date is the note's original date on the AAA surface,
      // never the date it was repatriated.
      assert.match(article.datePublished, /^2026-01-|^2025-12-/, `${route}: bad datePublished`);
    }
  });

  it("describes each published video as a video", () => {
    const videos = [
      {
        route: "/newsroom/introducing-selun",
        duration: "PT41S",
        uploadDate: "2026-03-28T23:05:48Z",
      },
      // No runtime is published for the Protocol overview — oEmbed returns
      // none — so the property is absent rather than estimated.
      {
        route: "/newsroom/sagitta-protocol-overview",
        duration: undefined,
        uploadDate: "2026-04-18T22:37:45Z",
      },
    ];
    for (const { route, duration, uploadDate } of videos) {
      const target = page(route);
      assert.ok(target, `${route} was not exported`);
      const video = blocks(target.html).find((b) => b["@type"] === "VideoObject");
      assert.ok(video, `${route}: published video emits no VideoObject`);
      assert.equal(video.uploadDate, uploadDate, `${route}: bad uploadDate`);
      assert.match(
        video.embedUrl,
        /^https:\/\/www\.youtube-nocookie\.com\/embed\//,
        `${route}: embed URL is not the privacy-enhanced host`,
      );
      assert.equal(video.duration, duration, `${route}: runtime does not match the source`);
      // The video file is YouTube's. A contentUrl here would be a claim this
      // site cannot honour.
      assert.equal(video.contentUrl, undefined, `${route}: claims a content URL it does not host`);
    }
  });

  it("describes the videos presented in Watch on the homepage", () => {
    const home = page("/");
    const videos = blocks(home.html).filter((block) => block["@type"] === "VideoObject");
    assert.equal(videos.length, 2, "homepage Watch schema does not match its published videos");
  });

  it("publishes a breadcrumb trail on every nested route", () => {
    const nested = [
      "/newsroom/the-three-deaths-doctrine",
      "/systems/sagitta-radar",
      "/careers/sales-engine-operator",
    ];
    for (const route of nested) {
      const target = page(route);
      assert.ok(target, `${route} was not exported`);
      const trail = blocks(target.html).find((b) => b["@type"] === "BreadcrumbList");
      assert.ok(trail, `${route}: nested route publishes no BreadcrumbList`);
      assert.equal(trail.itemListElement.length, 3, `${route}: trail is not home → section → page`);
      assert.equal(trail.itemListElement[0].position, 1);
      assert.ok(
        trail.itemListElement[2].item.endsWith(route),
        `${route}: trail does not end at its own page`,
      );
    }
  });

  it("links the founder to the organisation without conflating them", () => {
    const home = page("/");
    const org = blocks(home.html).find((b) => b["@type"] === "Organization");
    assert.ok(org.founder, "the organisation names no founder");

    const about = page("/about");
    const person = blocks(about.html).find((b) => b["@type"] === "Person");
    assert.equal(
      org.founder["@id"],
      person["@id"],
      "the founder edge and the Person node are different entities",
    );

    // The LinkedIn profile is the founder's, so it belongs on the Person and
    // must never appear in the organisation's identity set.
    assert.ok(
      (person.sameAs ?? []).some((url) => url.includes("linkedin.com/in/")),
      "the resolved LinkedIn profile is not published on the Person",
    );
    assert.ok(
      !(org.sameAs ?? []).some((url) => url.includes("linkedin.com")),
      "a personal profile is claimed as the organisation's own identity",
    );
  });
});
