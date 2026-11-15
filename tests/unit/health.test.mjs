// Network status checks: classification rules and coverage of every system.
//
// Run: npm run test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadTsModules } from "../../scripts/lib/load-ts.mjs";

const modules = loadTsModules(
  ["src/lib/health.ts", "src/content/health.ts", "src/content/index.ts"],
  "unit-tests-health",
);

const { probe, overallState } = modules["src/lib/health.ts"];
const { healthChecksBySystem } = modules["src/content/health.ts"];
const content = modules["src/content/index.ts"];

const check = { id: "x:site", kind: "site", label: "x", url: "https://x.example/" };
const options = (fetchImpl, clock = [0, 0, 0, 0]) => {
  let i = 0;
  return { fetchImpl, timeoutMs: 10_000, slowMs: 5_000, now: () => clock[Math.min(i++, clock.length - 1)] };
};
const ok = (status = 200) => ({ ok: status >= 200 && status < 300, status });
const named = (name) => Object.assign(new Error(name), { name });

describe("probe", () => {
  it("reports a readable 2xx as up", async () => {
    const result = await probe(check, options(async () => ok()));
    assert.equal(result.state, "up");
    assert.equal(result.status, 200);
  });

  it("reports a readable 2xx past the slow threshold as slow", async () => {
    const result = await probe(check, options(async () => ok(), [0, 6_000, 6_000, 6_000]));
    assert.equal(result.state, "slow");
  });

  it("reports a readable non-2xx as down with its status", async () => {
    const result = await probe(check, options(async () => ok(503)));
    assert.equal(result.state, "down");
    assert.equal(result.status, 503);
  });

  it("reports a timeout as down without retrying", async () => {
    let calls = 0;
    const result = await probe(check, options(async () => { calls++; throw named("TimeoutError"); }));
    assert.equal(result.state, "down");
    assert.equal(calls, 1);
  });

  it("reports a CORS-blocked target that answers opaquely as reachable", async () => {
    const result = await probe(check, options(async (_url, init) => {
      if (init.mode === "cors") throw new TypeError("Failed to fetch");
      return { ok: false, status: 0, type: "opaque" };
    }));
    assert.equal(result.state, "reachable");
  });

  it("reports a target that fails both reads as down", async () => {
    const result = await probe(check, options(async () => { throw new TypeError("Failed to fetch"); }));
    assert.equal(result.state, "down");
    assert.equal(result.detail, "Could not connect");
  });

  it("shows a JSON detail string from the service, up or down", async () => {
    const jsonResponse = (status, body) => ({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: async () => body,
    });
    const up = await probe(check, options(async () => jsonResponse(200, { detail: "10/10 routes answer unpaid calls with 402" })));
    assert.equal(up.state, "up");
    assert.equal(up.detail, "10/10 routes answer unpaid calls with 402");
    const down = await probe(check, options(async () => jsonResponse(503, { detail: "9/10 routes answer unpaid calls with 402" })));
    assert.equal(down.state, "down");
    assert.equal(down.detail, "9/10 routes answer unpaid calls with 402");
  });

  it("posts eth_blockNumber for chain checks", async () => {
    let seen;
    await probe({ ...check, jsonRpc: true }, options(async (_url, init) => { seen = init; return ok(); }));
    assert.equal(seen.method, "POST");
    assert.match(seen.body, /eth_blockNumber/);
  });
});

describe("overallState", () => {
  it("stays checking until every result is in, then reports the worst", () => {
    assert.equal(overallState([{ state: "up" }, { state: "checking" }]), "checking");
    assert.equal(overallState([{ state: "up" }, { state: "reachable" }]), "reachable");
    assert.equal(overallState([{ state: "slow" }, { state: "down" }, { state: "up" }]), "down");
  });
});

describe("health check coverage", () => {
  const systems = content.systems;

  it("gives every system with a public subdomain a site check on that subdomain", () => {
    for (const system of systems.filter((s) => s.subdomain)) {
      const checks = healthChecksBySystem[system.slug];
      assert.ok(checks, `${system.slug} has no health checks`);
      const siteCheck = checks.find((c) => c.kind === "site");
      assert.ok(siteCheck, `${system.slug} has no site check`);
      assert.equal(new URL(siteCheck.url).host, system.subdomain, `${system.slug} site check host`);
    }
  });

  it("only keys checks by real system slugs", () => {
    const slugs = new Set(systems.map((s) => s.slug));
    for (const slug of Object.keys(healthChecksBySystem)) {
      assert.ok(slugs.has(slug), `unknown system slug ${slug}`);
    }
  });
});
