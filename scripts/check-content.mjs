// Content validation for the public record.
//
// This runs against the compiled content layer before export and fails the
// build if anything incomplete, provisional, or internal could reach a public
// feed. It is the guard behind the Phase 2 truth rules.
//
// Usage: npm run check:content

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadContent } from "./lib/content.mjs";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const problems = [];
const fail = (message) => problems.push(message);

// The content layer is loaded through scripts/lib/content.mjs, shared with the
// Open Graph generator and its drift check so all three read the same values
// the pages import.

// ── Rules ────────────────────────────────────────────────────────────────────

const OPERATING_STATES = ["Operating", "Public Test", "In Development", "Research Horizon"];
const HORIZONS = ["Now", "Next", "Horizon"];
const CAREER_STATUSES = ["Open", "Contributor", "Future", "Archived"];
const FAMILIES = ["continuity-defense", "allocation-agent-intelligence", "capital-infrastructure"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isPublic = (r) => r.visibility === "public";
const isPublished = (r) => r.publicationState === "published";
const isLive = (r) => isPublic(r) && isPublished(r);

function checkDate(value, where) {
  if (value === null || value === undefined) return;
  if (!ISO_DATE.test(value)) fail(`${where}: date "${value}" is not YYYY-MM-DD`);
  else if (Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()))
    fail(`${where}: date "${value}" is not a real date`);
}

function checkVerification(record, where) {
  const v = record.verification;
  if (!v) return fail(`${where}: missing verification block`);
  if (!["verified", "provisional", "pending"].includes(v.status))
    fail(`${where}: invalid verification status "${v.status}"`);
  checkDate(v.lastVerifiedAt, `${where} lastVerifiedAt`);
  if (isLive(record) && v.status === "pending")
    fail(`${where}: pending record is publicly visible — hide it or verify it`);
  if (isLive(record) && !v.source) fail(`${where}: published record has no source`);
}

/**
 * Collects every string a record could render, excluding `verification.note`
 * and `verification.source`, which are editorial and never reach a reader.
 */
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

/**
 * Phase 3 removed product-level Labs attribution. The institutional
 * relationship is published on /about and /press; it must not appear beside a
 * product name. These patterns fail the build wherever public copy carries one.
 */
const FORBIDDEN_ATTRIBUTION = [
  /\bRadar\s+by\s+Sagitta\s+Labs\b/i,
  /\bSagitta\s+Radar\s+by\s+Sagitta\s+Labs\b/i,
  /\bDeveloped\s+by\s+Sagitta\s+Systems\b/i,
  /\bSagitta\s+\w+,?\s+by\s+Sagitta\s+Labs\b/i,
];

/** Generic labels a destination-led call to action may never use. */
const GENERIC_CTA_LABELS = [
  "learn more",
  "read more",
  "find out more",
  "click here",
  "see more",
  "get started",
  "explore",
];

const ACTION_TYPES = [
  "open-product",
  "documentation",
  "evidence",
  "demonstration",
  "defense-review",
  "partnership",
  "roadmap",
  "research",
  "press",
  "career",
  "system-entry",
  "contact",
];
const AVAILABILITIES = ["available", "by-request", "documented"];

function checkLocalAsset(href, where) {
  if (!href.startsWith("/") || href.startsWith("//")) return;
  const [pathname] = href.split("#");
  if (/\.[a-z0-9]{2,4}$/i.test(pathname)) {
    if (!existsSync(path.join(PUBLIC_DIR, pathname))) fail(`${where}: asset ${pathname} not found in public/`);
  }
}

/**
 * A call to action must name its destination, declare what kind of journey it
 * starts, and state whether that destination can be used now. An action that
 * cannot say those three things is a generic CTA wearing a costume.
 */
function checkAction(action, where, seenIds) {
  if (!action) return;
  for (const field of ["id", "label", "href", "type", "availability"]) {
    if (!action[field]) fail(`${where}: action is missing ${field}`);
  }
  if (!ACTION_TYPES.includes(action.type)) fail(`${where}: invalid action type "${action.type}"`);
  if (!AVAILABILITIES.includes(action.availability))
    fail(`${where}: invalid availability "${action.availability}"`);

  if (seenIds.has(action.id)) fail(`${where}: duplicate action id "${action.id}"`);
  seenIds.add(action.id);

  const label = (action.label ?? "").trim().toLowerCase();
  if (GENERIC_CTA_LABELS.includes(label))
    fail(`${where}: "${action.label}" is a generic label — name the destination`);

  const external = Boolean(action.external);
  const absolute = /^https?:\/\//.test(action.href ?? "");
  if (external && !absolute) fail(`${where}: action marked external but href is not absolute`);
  if (!external && absolute) fail(`${where}: absolute href must be marked external`);
  if (!external && !(action.href ?? "").startsWith("/"))
    fail(`${where}: internal action href must start with "/"`);
}

function main() {
  const content = loadContent();

  const {
    systems,
    capabilities,
    publicSystems,
    publicCapabilities,
    systemCount,
    newsroomEntries,
    publishedEntries,
    desks,
    careers,
    publicCareers,
    openCareers,
    roadmapItems,
    publicRoadmapItems,
    pressStatistics,
    pressSections,
    people,
    sagittaLabsAliases,
    archivedCapabilities,
  } = content;

  const systemSlugs = new Set(systems.map((s) => s.slug));
  const capabilitySlugs = new Set(capabilities.map((c) => c.slug));
  const allSlugs = new Set([...systemSlugs, ...capabilitySlugs]);
  const entrySlugs = new Set(newsroomEntries.map((e) => e.slug));
  const deskIds = new Set(desks.map((d) => d.id));

  // ── Systems ────────────────────────────────────────────────────────────────
  //
  // The ecosystem is three core foundations, four services attached to them,
  // and one concept-stage system. The counts are asserted rather than the total
  // alone, so a service could not silently be promoted to a foundation while
  // the headline number stayed right.
  if (systemCount !== 8)
    fail(`systems: expected exactly 8 public systems, found ${systemCount}`);

  const cores = publicSystems.filter((s) => s.systemKind === "core");
  const services = publicSystems.filter((s) => s.systemKind === "service");
  const concepts = publicSystems.filter((s) => s.systemKind === "concept");

  if (cores.length !== 3)
    fail(`systems: expected 3 core systems, found ${cores.length}`);
  if (services.length !== 4)
    fail(`systems: expected 4 service systems, found ${services.length}`);
  if (cores.length + services.length + concepts.length !== systemCount)
    fail("systems: a public system carries no architectural kind");

  for (const slug of ["aaa", "sagitta-continuity-engine", "sagitta-protocol"]) {
    const system = systems.find((s) => s.slug === slug);
    if (!system) fail(`systems: core system "${slug}" is missing`);
    else if (system.systemKind !== "core")
      fail(`system "${slug}": is a core foundation but is typed "${system.systemKind}"`);
  }

  const SERVICE_PARENTS = {
    selun: "aaa",
    "sagitta-defense": "sagitta-continuity-engine",
    "sagitta-radar": "sagitta-continuity-engine",
    "sagitta-banking": "sagitta-protocol",
  };
  for (const [slug, parent] of Object.entries(SERVICE_PARENTS)) {
    const system = systems.find((s) => s.slug === slug);
    if (!system) fail(`systems: service system "${slug}" is missing`);
    else if (system.parentSystem !== parent)
      fail(`system "${slug}": attached to "${system.parentSystem}", expected "${parent}"`);
  }

  // Sagitta Wallet is concept-stage. It is never presented as operating, and
  // its lack of promotional material is a correct state rather than a gap.
  const wallet = systems.find((s) => s.slug === "sagitta-wallet");
  if (wallet) {
    if (wallet.systemKind !== "concept")
      fail(`system "sagitta-wallet": must be typed as a concept-stage system`);
    if (!["Research Horizon", "In Development"].includes(wallet.status))
      fail(`system "sagitta-wallet": "${wallet.status}" presents a concept as further along than it is`);
  }

  // Selun x402 is a surface of Selun, not a peer product. The Treasury
  // Decision Desk is not a Sagitta system at all and must not reappear.
  for (const slug of ["grants", "rebalancing", "selun-x402"]) {
    if (systemSlugs.has(slug)) fail(`systems: "${slug}" must be a capability, not a system`);
    if (!capabilitySlugs.has(slug)) fail(`capabilities: "${slug}" is missing`);
  }
  if (allSlugs.has("treasury-decision-desk"))
    fail('systems: "treasury-decision-desk" is not a Sagitta product and must not be modelled');

  for (const system of systems) {
    if (system.systemKind === "service" && !system.parentSystem)
      fail(`system "${system.slug}": a service must name the foundation it is attached to`);
    if (system.systemKind !== "service" && system.parentSystem)
      fail(`system "${system.slug}": only a service carries a parent system`);
    if (system.parentSystem) {
      const parent = systems.find((s) => s.slug === system.parentSystem);
      if (!parent) fail(`system "${system.slug}": unknown parent "${system.parentSystem}"`);
      else if (parent.systemKind !== "core")
        fail(`system "${system.slug}": parent "${parent.slug}" is not a core foundation`);
    }
  }

  for (const family of FAMILIES) {
    const members = publicSystems.filter((s) => s.family === family);
    if (members.length === 0) fail(`systems: family "${family}" has no public systems`);
  }

  // ── The ecosystem relationship ─────────────────────────────────────────────
  //
  // The second relationship: what each system contributes to the Sagitta
  // Protocol ecosystem. It is orthogonal to the family grouping and to
  // core/service/parent, and it is the reason the network is a network rather
  // than a portfolio — so it is asserted, not left to editorial discipline.
  for (const system of publicSystems) {
    const role = system.ecosystemRole;
    if (!role || role.length < 30)
      fail(`system "${system.slug}": ecosystemRole is missing or too short`);
    else if (!/[.!]$/.test(role.trim()))
      fail(`system "${system.slug}": ecosystemRole is not written as a sentence`);
  }

  const flow = content.ecosystemFlow();
  if (!flow) {
    fail("ecosystem: Sagitta Protocol is not published — the ecosystem has no centre");
  } else {
    // Derived from the same records the architecture uses, so these counts
    // restate the architecture from the other direction. If a service were
    // reattached or a foundation added, one of these fails rather than the
    // figure quietly redrawing itself around a claim nobody reviewed.
    if (flow.capabilities.length !== 2)
      fail(`ecosystem: expected 2 capability foundations feeding the Protocol, found ${flow.capabilities.length}`);
    if (flow.surfaces.length !== 4)
      fail(`ecosystem: expected 4 commercial surfaces, found ${flow.surfaces.length}`);
    if (flow.surfaces.filter((s) => !s.via).length !== 1)
      fail("ecosystem: exactly one surface — Sagitta Banking — connects to the Protocol directly");
    if (flow.protocol.slug !== "sagitta-protocol")
      fail(`ecosystem: the centre resolved to "${flow.protocol.slug}"`);

    // The Protocol's own foundations must state that they run inside it,
    // otherwise the figure draws an arrow the records do not support.
    for (const capability of flow.capabilities) {
      if (!/protocol/i.test(capability.ecosystemRole))
        fail(`system "${capability.slug}": is drawn feeding the Protocol but never names it`);
    }

    // A concept-stage system contributes a concept. Saying anything else here
    // would claim an operating capability the demo does not have — the same
    // error the promotional layer avoids by marking Wallet N/A.
    for (const system of flow.horizon) {
      if (!/not an operating capability/i.test(system.ecosystemRole))
        fail(`system "${system.slug}": a concept-stage contribution must say it is not operating`);
    }
  }

  // The thesis is written once in `site.ts` and rendered on three surfaces. A
  // hand-written paraphrase on any of them is the drift this check exists to
  // catch, so each file is required to reference the shared record.
  const { ecosystemThesis } = content;
  for (const [key, text] of Object.entries(ecosystemThesis)) {
    if (!text || text.length < 40) fail(`ecosystemThesis.${key}: missing or too short`);
  }
  if (!/Sagitta Protocol ecosystem/.test(ecosystemThesis.short))
    fail("ecosystemThesis.short: does not name the Sagitta Protocol ecosystem");
  if (!/Protocol ecosystem/.test(content.site.identity))
    fail("site.identity: the purpose statement does not name the Protocol ecosystem");

  // The canonical dual view has to keep holding both structures. Half of it
  // survives an edit perfectly well while saying something the site does not
  // mean — architecture alone reads as a portfolio, purpose alone demotes two
  // foundations to accessories — so both halves are asserted separately.
  const { dualView } = ecosystemThesis;
  for (const foundation of ["AAA", "SCE", "Sagitta Protocol"]) {
    if (!dualView.includes(foundation))
      fail(`ecosystemThesis.dualView: does not name "${foundation}" as a core foundation`);
  }
  if (!/core architectural foundations/.test(dualView))
    fail("ecosystemThesis.dualView: no longer states the three-foundation architecture");
  if (!/required by the Sagitta Protocol ecosystem/.test(dualView))
    fail("ecosystemThesis.dualView: no longer states what the foundations are for");

  // The press room's approved identity statement is the same record, not a
  // paraphrase of it. A journalist quoting Sagitta and a reader on the site
  // must get the same two sentences.
  const identityStatement = pressSections
    .flatMap((section) => section.resources)
    .find((resource) => resource.id === "identity-statement");
  if (!identityStatement)
    fail("press: the approved identity statement is missing");
  else if (identityStatement.description !== dualView)
    fail("press identity-statement: does not carry the canonical dual view verbatim");

  const THESIS_SURFACES = {
    "src/app/page.tsx": ["ecosystemThesis.short"],
    "src/app/about/page.tsx": ["ecosystemThesis.short", "ecosystemThesis.purpose", "ecosystemThesis.dualView"],
    "src/app/systems/page.tsx": ["ecosystemThesis.short", "ecosystemThesis.dualView"],
    "src/components/EcosystemFlow.tsx": ["ecosystemThesis.purpose"],
  };
  for (const [file, references] of Object.entries(THESIS_SURFACES)) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) {
      fail(`${file}: missing — the ecosystem thesis has lost a surface`);
      continue;
    }
    const source = readFileSync(full, "utf8");
    for (const reference of references) {
      if (!source.includes(reference))
        fail(`${file}: does not render ${reference} — the thesis may have been paraphrased`);
    }
  }

  const actionIds = new Set();

  for (const system of systems) {
    const where = `system "${system.slug}"`;
    if (!FAMILIES.includes(system.family)) fail(`${where}: invalid family "${system.family}"`);
    if ("attribution" in system)
      fail(`${where}: product-level attribution is not published — see the Phase 3 naming rules`);

    if (!system.primaryAction) fail(`${where}: no primary action`);
    checkAction(system.primaryAction, `${where} primaryAction`, actionIds);
    checkAction(system.secondaryAction, `${where} secondaryAction`, actionIds);

    // An action may not promise more than the operating state supports.
    if (system.primaryAction?.type === "open-product" && system.status !== "Operating")
      fail(`${where}: "${system.status}" system offers an open-product action`);
    if (system.status === "Operating" && system.primaryAction?.availability === "documented")
      fail(`${where}: an Operating system's primary action is only documented`);

    for (const connection of system.connections ?? []) {
      if (!systemSlugs.has(connection.slug))
        fail(`${where}: connection references unknown system "${connection.slug}"`);
      if (connection.slug === system.slug) fail(`${where}: connection points at itself`);
      if (!["structural", "contextual"].includes(connection.strength))
        fail(`${where}: invalid connection strength "${connection.strength}"`);
      if (!connection.reason || connection.reason.length < 15)
        fail(`${where}: connection to "${connection.slug}" has no stated reason`);
    }

    if (!OPERATING_STATES.includes(system.status))
      fail(`${where}: invalid operating state "${system.status}"`);
    for (const field of ["summary", "problem", "statusEvidence"]) {
      if (!system[field] || system[field].length < 20) fail(`${where}: ${field} is missing or too short`);
    }
    if (!Array.isArray(system.overview) || system.overview.length === 0)
      fail(`${where}: overview is empty`);
    if (!Array.isArray(system.availableToday) || system.availableToday.length === 0)
      fail(`${where}: availableToday is empty`);
    if (!Array.isArray(system.audience) || system.audience.length === 0)
      fail(`${where}: audience is empty`);
    checkVerification(system, where);
    for (const link of system.evidence) checkLocalAsset(link.href, `${where} evidence`);
    if (system.logo) checkLocalAsset(system.logo, `${where} logo`);
    if (system.wordmark) checkLocalAsset(system.wordmark, `${where} wordmark`);
    for (const slug of system.capabilitySlugs ?? []) {
      if (!capabilitySlugs.has(slug)) fail(`${where}: unknown capability "${slug}"`);
    }
  }

  for (const capability of capabilities) {
    const where = `capability "${capability.slug}"`;
    checkVerification(capability, where);
    if (capability.deliveredBy.length === 0) fail(`${where}: deliveredBy is empty`);
    for (const slug of capability.deliveredBy) {
      if (!systemSlugs.has(slug)) fail(`${where}: deliveredBy references unknown system "${slug}"`);
    }
    if ("status" in capability) fail(`${where}: capabilities must not carry an operating state`);
    if (capability.publicationState === "archived" && publicCapabilities.includes(capability))
      fail(`${where}: archived capability is listed as a current offering`);
  }

  // Grants is archived by decision, not merely unlinked.
  const grants = capabilities.find((c) => c.slug === "grants");
  if (grants && grants.publicationState !== "archived")
    fail(`capability "grants": must be archived, not "${grants?.publicationState}"`);

  // ── Newsroom ───────────────────────────────────────────────────────────────
  for (const entry of newsroomEntries) {
    const where = `newsroom "${entry.slug}"`;
    if (!deskIds.has(entry.desk)) fail(`${where}: unknown desk "${entry.desk}"`);
    checkDate(entry.publishedAt, `${where} publishedAt`);
    checkDate(entry.updatedAt, `${where} updatedAt`);
    checkVerification(entry, where);

    for (const field of ["title", "summary", "author"]) {
      if (!entry[field]) fail(`${where}: missing ${field}`);
    }
    if (!entry.externalUrl && (!entry.body || entry.body.length === 0))
      fail(`${where}: has neither an external destination nor internal body content`);

    // A published record has to say something on its own page.
    //
    // Twelve records used to carry a two-sentence body whose entire content was
    // that the real work lived somewhere else — so a reader arriving from a
    // search result got fifty words and a button to leave, and the hub indexed
    // the network's writing without publishing any of it. The rule was never
    // written down, which is exactly why it was violated twelve times. 120 words
    // is well beneath every real treatment and well above any stub.
    if (isLive(entry)) {
      const words = content
        .newsroomBodyText(entry.body ?? [])
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      if (words < 120)
        fail(
          `${where}: body is ${words} words — a published record carries its own treatment, not a pointer (minimum 120)`,
        );
    }
    if (entry.externalUrl && !entry.externalLabel && entry.externalUrl.startsWith("http"))
      fail(`${where}: external destination has no action label`);

    // `externalUrl` carries two unrelated meanings — a canonical publication
    // hosted elsewhere, and a product surface the record merely points at — and
    // structured data has to tell them apart. Leaving the role implicit is what
    // made Article markup wrong in the first place, so it is required rather
    // than defaulted.
    if (entry.externalUrl && !entry.externalRole)
      fail(`${where}: external destination has no externalRole ("canonical" or "reference")`);
    if (entry.externalRole && !["canonical", "reference"].includes(entry.externalRole))
      fail(`${where}: invalid externalRole "${entry.externalRole}"`);
    if (entry.externalRole && !entry.externalUrl)
      fail(`${where}: declares an externalRole with no externalUrl`);

    for (const slug of [entry.systemSlug, ...(entry.relatedSystems ?? [])].filter(Boolean)) {
      if (!allSlugs.has(slug)) fail(`${where}: references unknown system "${slug}"`);
    }
    if (entry.heroImage) checkLocalAsset(entry.heroImage, `${where} heroImage`);
    if (entry.externalUrl) checkLocalAsset(entry.externalUrl, `${where} externalUrl`);

    if (/placeholder/i.test(entry.slug) || /placeholder/i.test(entry.title)) {
      if (isLive(entry)) fail(`${where}: placeholder record is publicly published`);
    }
  }

  for (const entry of publishedEntries) {
    if (!isLive(entry)) fail(`newsroom "${entry.slug}": leaked into publishedEntries`);
  }

  // Every desk marked active must actually have a published record, and vice versa.
  for (const desk of desks) {
    const count = publishedEntries.filter((e) => e.desk === desk.id).length;
    if (desk.state === "active" && count === 0)
      fail(`desk "${desk.id}": marked active but has no published records`);
    if (desk.state === "upcoming" && count > 0)
      fail(`desk "${desk.id}": marked upcoming but has ${count} published records`);
    if (desk.systemSlug && !allSlugs.has(desk.systemSlug))
      fail(`desk "${desk.id}": references unknown system "${desk.systemSlug}"`);
  }

  // ── Careers ────────────────────────────────────────────────────────────────
  for (const career of careers) {
    const where = `career "${career.slug}"`;
    if (!CAREER_STATUSES.includes(career.status)) fail(`${where}: invalid status "${career.status}"`);
    if (career.systemSlug && !allSlugs.has(career.systemSlug))
      fail(`${where}: references unknown system "${career.systemSlug}"`);
    checkDate(career.publishedAt, `${where} publishedAt`);
    checkDate(career.updatedAt, `${where} updatedAt`);
    checkVerification(career, where);
    if (isPublic(career) && !career.systemSlug)
      fail(`${where}: public role has no supporting system`);
    if (isPublic(career) && !career.hiringContact) fail(`${where}: public role has no hiring contact`);
  }

  for (const career of openCareers) {
    if (career.compensation.startsWith("Not yet"))
      fail(`career "${career.slug}": listed as Open without published compensation terms`);
  }
  for (const career of publicCareers) {
    if (career.visibility !== "public") fail(`career "${career.slug}": leaked into publicCareers`);
  }

  // ── Roadmap ────────────────────────────────────────────────────────────────
  for (const item of roadmapItems) {
    const where = `roadmap "${item.id}"`;
    if (!OPERATING_STATES.includes(item.state)) fail(`${where}: invalid state "${item.state}"`);
    if (!HORIZONS.includes(item.horizon)) fail(`${where}: invalid horizon "${item.horizon}"`);
    if (!item.systemSlug) fail(`${where}: no related system`);
    else if (!allSlugs.has(item.systemSlug))
      fail(`${where}: references unknown system "${item.systemSlug}"`);
    checkDate(item.updatedAt, `${where} updatedAt`);
    checkVerification(item, where);
    if (item.state === "Operating" && item.horizon !== "Now")
      fail(`${where}: Operating items belong in the Now horizon`);
    if (item.evidence) checkLocalAsset(item.evidence.href, `${where} evidence`);
  }
  for (const horizon of HORIZONS) {
    if (!publicRoadmapItems.some((i) => i.horizon === horizon))
      fail(`roadmap: horizon "${horizon}" has no public items`);
  }

  // ── Press ──────────────────────────────────────────────────────────────────
  for (const stat of pressStatistics) {
    const where = `statistic "${stat.id}"`;
    for (const field of ["metric", "value", "scope"]) {
      if (!stat[field]) fail(`${where}: missing ${field}`);
    }
    if (!stat.source?.href) fail(`${where}: missing source`);
    if (!stat.verification?.lastVerifiedAt) fail(`${where}: no last-verified date`);
    checkVerification(stat, where);
    checkLocalAsset(stat.source?.href ?? "", `${where} source`);
  }

  for (const section of pressSections) {
    for (const resource of section.resources) {
      const where = `press resource "${resource.id}"`;
      checkVerification(resource, where);
      for (const link of resource.links) checkLocalAsset(link.href, `${where} link`);
      if (isLive(resource) && /^(pending|not yet compiled|no approved)/i.test(resource.description))
        fail(`${where}: pending filler is publicly visible`);
    }
  }

  // ── Naming and identity ────────────────────────────────────────────────────
  //
  // Sweeps every string that could render publicly. `verification.note` and
  // `verification.source` are excluded — they are the editorial record of *why*
  // a rule exists and may quote the wording the rule forbids.
  const namedCollections = [
    ["systems", systems],
    ["capabilities", capabilities],
    ["newsroom", newsroomEntries],
    ["careers", careers],
    ["roadmap", roadmapItems],
    ["press resources", pressSections.flatMap((s) => s.resources)],
    ["press statistics", pressStatistics],
    ["people", people],
    ["videos", content.videos ?? []],
    ["site", [content.site, ...content.identityHierarchy]],
  ];

  // The press room's naming guidance is the one place the forbidden lockup may
  // appear, because its whole purpose is to quote the form and forbid it. The
  // exemption is keyed to that single record id so it cannot widen silently.
  const ATTRIBUTION_EXEMPT_IDS = new Set(["naming"]);

  for (const [name, records] of namedCollections) {
    for (const record of records) {
      if (record.visibility === "internal") continue;
      if (ATTRIBUTION_EXEMPT_IDS.has(record.id)) continue;
      for (const text of publicStrings(record)) {
        for (const pattern of FORBIDDEN_ATTRIBUTION) {
          if (pattern.test(text))
            fail(
              `${name}: public copy carries product-level Labs attribution — "${text.slice(0, 90)}…"`,
            );
        }
      }
    }
  }

  // Sagitta Labs is a brand architecture, not an incorporated company.
  for (const level of content.identityHierarchy) {
    if (level.name !== "Sagitta Labs") continue;
    if (/\b(incorporated|Inc\.|LLC|Ltd\.?|corporation)\b/i.test(level.note)) {
      if (!/rather than an incorporated entity/i.test(level.note))
        fail("identityHierarchy: Sagitta Labs is described as an incorporated entity");
    }
  }

  // ── Capability actions ─────────────────────────────────────────────────────
  for (const capability of capabilities) {
    const where = `capability "${capability.slug}"`;
    checkAction(capability.primaryAction, `${where} primaryAction`, actionIds);
    if (capability.publicationState === "archived" && capability.primaryAction)
      fail(`${where}: an archived capability must not offer a call to action`);
  }

  // ── Newsroom media ─────────────────────────────────────────────────────────
  //
  // The audio and video components ship ahead of the first recorded
  // publication. They render only from this block, so an empty block is the
  // correct state — but a populated one must point at something real.
  for (const entry of newsroomEntries) {
    const media = entry.media;
    if (!media) continue;
    const where = `newsroom "${entry.slug}" media`;
    if (!["audio", "video"].includes(media.kind)) fail(`${where}: invalid kind "${media.kind}"`);
    if (!["native", "embed"].includes(media.delivery))
      fail(`${where}: invalid delivery "${media.delivery}"`);
    if (!media.src) fail(`${where}: no source`);
    if (media.delivery === "native") checkLocalAsset(media.src, where);
    if (media.poster) checkLocalAsset(media.poster, `${where} poster`);
    if (isLive(entry) && entry.verification.status !== "verified")
      fail(`${where}: published media must be verified`);
  }

  // ── Promotions ─────────────────────────────────────────────────────────────
  //
  // The homepage is driven entirely by this collection, so the truth rules that
  // protect the institutional record have to hold here too — plus the density
  // rules that keep the front page a broadcast rather than a catalogue.
  const {
    promotions,
    activePromotions,
    promotionFormats,
    promotionChannelRecords,
    decisionLenses,
    promotionsAt,
    evidenceArtifacts,
    publicArtifacts,
  } = content;

  const FORMATS = [
    "live-signal",
    "alert-status",
    "launch-milestone",
    "product-interface",
    "use-case",
    "article",
    "research-report",
    "social-post",
    "video-episode",
    "audio-briefing",
    "case-study",
    "external-coverage",
    "event-appearance",
  ];
  const CHANNELS = [
    "sagitta-systems",
    "sagitta-product",
    "x",
    "linkedin",
    "youtube",
    "paragraph",
    "external-publication",
  ];
  const PLACEMENTS = [
    "lead-carousel",
    "signal-strip",
    "product-feature",
    "video-feature",
    "network-headlines",
    "cinematic-feature",
  ];
  const LENSES = [
    "fund-allocation",
    "policy-governance",
    "sector-portfolios",
    "defi-health",
    "protocol-readiness",
    "cve-defense",
    "onchain-banking",
    "crypto-functionality",
  ];
  const MEDIA_KINDS = [
    "system-mark",
    "diagram",
    "constellation",
    "report-cover",
    "article-cover",
    "product-screenshot",
    "video-thumbnail",
    "social-preview",
    "audio-art",
  ];

  // All thirteen formats are modelled, whether or not one has a record yet.
  if (promotionFormats.length !== FORMATS.length)
    fail(`promotionFormats: expected all ${FORMATS.length} formats, found ${promotionFormats.length}`);
  for (const format of FORMATS) {
    if (!promotionFormats.some((f) => f.id === format))
      fail(`promotionFormats: format "${format}" is not modelled`);
  }
  for (const format of promotionFormats) {
    if (!format.label) fail(`promotionFormats "${format.id}": no editorial label`);
    for (const stage of format.stages) {
      if (!PLACEMENTS.includes(stage))
        fail(`promotionFormats "${format.id}": unknown stage "${stage}"`);
    }
  }

  // Every decision lens routes into real systems.
  if (decisionLenses.length !== LENSES.length)
    fail(`decisionLenses: expected ${LENSES.length} lenses, found ${decisionLenses.length}`);
  for (const lens of decisionLenses) {
    if (!LENSES.includes(lens.id)) fail(`decisionLenses: unknown lens "${lens.id}"`);
    if (lens.systemSlugs.length === 0) fail(`decisionLenses "${lens.id}": routes into nothing`);
    for (const slug of lens.systemSlugs) {
      if (!allSlugs.has(slug))
        fail(`decisionLenses "${lens.id}": references unknown system "${slug}"`);
    }
  }

  // ── Channels ───────────────────────────────────────────────────────────────
  //
  // Every channel in the type layer is modelled once, in data. A channel that
  // claims to be active has to have a promotion behind it, and a channel URL is
  // only recorded where one was actually resolved.
  const channelIds = new Set();
  for (const channel of promotionChannelRecords) {
    const where = `channel "${channel.id}"`;
    if (!CHANNELS.includes(channel.id)) fail(`${where}: unknown channel`);
    if (channelIds.has(channel.id)) fail(`${where}: duplicate channel record`);
    channelIds.add(channel.id);
    if (!channel.label) fail(`${where}: no label`);
    if (typeof channel.active !== "boolean") fail(`${where}: does not state whether it is active`);
    if (channel.url && !/^https?:\/\//.test(channel.url))
      fail(`${where}: url "${channel.url}" is not absolute`);
    checkVerification(channel, where);
  }
  for (const id of CHANNELS) {
    if (!channelIds.has(id)) fail(`channels: "${id}" is not modelled`);
  }

  // The four external channels are the ones this pass activated. Each must be
  // active and each must have at least one real promotion pointing at it.
  for (const id of ["x", "linkedin", "youtube", "paragraph"]) {
    const channel = promotionChannelRecords.find((c) => c.id === id);
    if (!channel?.active) fail(`channels: "${id}" is modelled but not active`);
    const carried = promotions.filter((p) => p.channel === id);
    if (carried.length === 0)
      fail(`channels: "${id}" is marked active but no promotion is published on it`);
    for (const promotion of carried) {
      if (!/^https?:\/\//.test(promotion.action?.href ?? ""))
        fail(`promotion "${promotion.id}": on channel "${id}" but has no external destination`);
    }
  }

  // The Paragraph publication page is not an article destination, and neither
  // is an authoring dashboard.
  for (const promotion of promotions.filter((p) => p.channel === "paragraph")) {
    const href = promotion.action?.href ?? "";
    if (!/^https:\/\/paragraph\.com\/@sagitta\/.+/.test(href))
      fail(`promotion "${promotion.id}": Paragraph destination must be an article URL, got "${href}"`);
  }
  // An X promotion points at the exact public post, never at the profile.
  for (const promotion of promotions.filter((p) => p.channel === "x")) {
    const href = promotion.action?.href ?? "";
    if (!/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(href))
      fail(`promotion "${promotion.id}": X destination must be a post URL, got "${href}"`);
  }

  // ── Evidence artifacts ─────────────────────────────────────────────────────
  //
  // What an artifact proves is recorded, not inferred. The rules that matter:
  // an architecture brief is never described as a delivered result, a sample
  // output is never described as a customer's, and a preview must come from the
  // artifact itself.
  const ARTIFACT_KINDS = [
    "architecture-brief",
    "sample-output",
    "research-document",
    "business-case",
    "executed-result",
  ];
  const ARTIFACT_MEDIA = ["pdf", "diagram", "web-document", "dataset"];
  const artifactIds = new Set();

  for (const artifact of evidenceArtifacts ?? []) {
    const where = `artifact "${artifact.id}"`;
    if (artifactIds.has(artifact.id)) fail(`${where}: duplicate artifact id`);
    artifactIds.add(artifact.id);
    if (!ARTIFACT_KINDS.includes(artifact.kind)) fail(`${where}: invalid kind "${artifact.kind}"`);
    if (!ARTIFACT_MEDIA.includes(artifact.medium))
      fail(`${where}: invalid medium "${artifact.medium}"`);
    if (!artifact.title) fail(`${where}: no title`);
    if (!artifact.proves || artifact.proves.length < 30)
      fail(`${where}: does not state what it actually proves`);
    if (!allSlugs.has(artifact.systemSlug))
      fail(`${where}: references unknown system "${artifact.systemSlug}"`);
    if (!artifact.publicUrl && !artifact.sourcePath)
      fail(`${where}: has neither a public destination nor a source path`);
    if (artifact.publicUrl) checkLocalAsset(artifact.publicUrl, `${where} publicUrl`);
    checkVerification(artifact, where);

    if (artifact.dated) {
      checkDate(artifact.dated.date, `${where} dated`);
      if (!["published", "created"].includes(artifact.dated.basis))
        fail(`${where}: a date must say whether it is a publication or a creation date`);
    }
    if (artifact.pageCount !== undefined && !Number.isInteger(artifact.pageCount))
      fail(`${where}: page count is not a whole number read from the file`);

    if (artifact.preview) {
      if (!artifact.preview.src) fail(`${where} preview: no source`);
      if (typeof artifact.preview.alt !== "string")
        fail(`${where} preview: alternative text is required`);
      if (!MEDIA_KINDS.includes(artifact.preview.kind))
        fail(`${where} preview: invalid kind "${artifact.preview.kind}"`);
      // A mark is not a page of a document. A preview stands in for the
      // artifact only when it is actually rendered from it.
      if (artifact.preview.kind === "system-mark")
        fail(`${where} preview: a system mark is not a page of the artifact`);
      checkLocalAsset(artifact.preview.src, `${where} preview`);
    }

    // An architecture brief describes intent. It may not claim delivery.
    if (artifact.kind === "architecture-brief" && /\b(delivered|implemented|in production|deployed for)\b/i.test(artifact.proves))
      fail(`${where}: an architecture brief is described as an implemented result`);
    // A sample output is a specimen, never a customer's.
    if (artifact.kind === "sample-output" && /\b(client|customer|testimon)/i.test(artifact.proves.replace(/names no client/i, "")))
      fail(`${where}: a sample output is described as customer work`);
  }

  for (const artifact of publicArtifacts ?? []) {
    if (!isLive(artifact)) fail(`artifact "${artifact.id}": leaked into publicArtifacts`);
    if (artifact.verification.status !== "verified")
      fail(`artifact "${artifact.id}": a public artifact must be verified`);
  }

  // ── Video ──────────────────────────────────────────────────────────────────
  //
  // One record per video, resolved by every surface that stages it. The rules
  // that matter: a video points at a real system, its poster is a real local
  // file, and it states whether the provider actually lists it — an unlisted
  // video is not discoverable, and nothing may present it as though it were.
  const { videos, publicVideos } = content;
  const VIDEO_CLASSIFICATIONS = ["Product Overview", "Demonstration", "Episode", "Presentation"];
  const VIDEO_LISTINGS = ["public", "unlisted"];
  const videoIds = new Set();

  for (const video of videos ?? []) {
    const where = `video "${video.id}"`;
    if (videoIds.has(video.id)) fail(`${where}: duplicate video id`);
    videoIds.add(video.id);

    for (const field of ["title", "standfirst", "description", "duration", "channelName"]) {
      if (!video[field]) fail(`${where}: missing ${field}`);
    }
    if (!VIDEO_CLASSIFICATIONS.includes(video.classification))
      fail(`${where}: invalid classification "${video.classification}"`);
    if (!VIDEO_LISTINGS.includes(video.listing))
      fail(`${where}: does not state whether the provider lists it publicly`);
    if (video.provider !== "youtube") fail(`${where}: unsupported provider "${video.provider}"`);
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(video.providerVideoId ?? ""))
      fail(`${where}: "${video.providerVideoId}" is not a video id`);
    // The id that plays and the page the reader is sent to are the same video,
    // for the same reason the promotion embed check exists.
    if (video.providerVideoId && !(video.sourceUrl ?? "").includes(video.providerVideoId))
      fail(`${where}: sourceUrl "${video.sourceUrl}" is not the video ${video.providerVideoId}`);
    if (!allSlugs.has(video.systemSlug))
      fail(`${where}: references unknown system "${video.systemSlug}"`);
    // A runtime is published as the source publishes it, never rounded to prose.
    if (video.duration && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(video.duration))
      fail(`${where}: duration "${video.duration}" is not a runtime`);
    checkDate(video.publishedAt, `${where} publishedAt`);
    checkVerification(video, where);

    if (!video.poster?.src) fail(`${where}: no poster`);
    else checkLocalAsset(video.poster.src, `${where} poster`);
    if (typeof video.poster?.alt !== "string")
      fail(`${where} poster: alternative text is required`);

    // The provider's thumbnail is stored locally. A remote poster would put a
    // third-party request on every page that lists the video.
    if (/^https?:\/\//.test(video.poster?.src ?? ""))
      fail(`${where} poster: must be stored locally, not fetched from a third party`);
  }

  for (const video of publicVideos ?? []) {
    if (!isLive(video)) fail(`video "${video.id}": leaked into publicVideos`);
    if (video.verification.status !== "verified")
      fail(`video "${video.id}": a public video must be verified`);
  }

  const promotionIds = new Set();
  const sentences = (text) => (text.match(/[.!?](\s|$)/g) ?? []).length;

  for (const promotion of promotions) {
    const where = `promotion "${promotion.id}"`;

    if (promotionIds.has(promotion.id)) fail(`${where}: duplicate promotion id`);
    promotionIds.add(promotion.id);

    if (!FORMATS.includes(promotion.format)) fail(`${where}: invalid format "${promotion.format}"`);
    if (!CHANNELS.includes(promotion.channel))
      fail(`${where}: invalid channel "${promotion.channel}"`);
    if (!PLACEMENTS.includes(promotion.placement))
      fail(`${where}: invalid placement "${promotion.placement}"`);
    if (!["active", "archived"].includes(promotion.state))
      fail(`${where}: invalid state "${promotion.state}"`);
    if (typeof promotion.priority !== "number")
      fail(`${where}: no display priority`);

    for (const field of ["eyebrow", "headline", "sourceName"]) {
      if (!promotion[field]) fail(`${where}: missing ${field}`);
    }
    // One sentence of context, or none. The image and the headline carry the slide.
    if (promotion.context && sentences(promotion.context) > 1)
      fail(`${where}: context runs to more than one sentence`);

    if (!Array.isArray(promotion.systemSlugs) || promotion.systemSlugs.length === 0)
      fail(`${where}: routes into no system`);
    for (const slug of promotion.systemSlugs ?? []) {
      if (!allSlugs.has(slug)) fail(`${where}: references unknown system "${slug}"`);
    }
    if (!Array.isArray(promotion.lens) || promotion.lens.length === 0)
      fail(`${where}: carries no decision lens`);
    for (const lens of promotion.lens ?? []) {
      if (!LENSES.includes(lens)) fail(`${where}: invalid decision lens "${lens}"`);
    }
    for (const slug of promotion.capabilitySlugs ?? []) {
      if (!capabilitySlugs.has(slug)) fail(`${where}: unknown capability "${slug}"`);
    }
    if (!Array.isArray(promotion.audience) || promotion.audience.length === 0)
      fail(`${where}: no intended audience`);

    // A display headline is a shortening of the canonical title, never a
    // replacement for it or a longer rewrite of it.
    if (promotion.displayHeadline) {
      if (promotion.displayHeadline === promotion.headline)
        fail(`${where}: displayHeadline duplicates the canonical headline`);
      if (promotion.displayHeadline.length >= promotion.headline.length)
        fail(`${where}: displayHeadline is not shorter than the canonical headline`);
    }

    if (promotion.artifactId && !artifactIds.has(promotion.artifactId))
      fail(`${where}: references unknown artifact "${promotion.artifactId}"`);

    // A promotion that stages a canonical video restates some of it — the deck
    // renders the promotion, not the video record — so the two are held to
    // agreement rather than to trust. This is the whole point of having one
    // canonical record: a duration corrected on the video must not leave a
    // stale one on the homepage.
    if (promotion.videoId) {
      const video = (videos ?? []).find((v) => v.id === promotion.videoId);
      if (!video) {
        fail(`${where}: references unknown video "${promotion.videoId}"`);
      } else {
        if (promotion.format !== "video-episode")
          fail(`${where}: only a video promotion may stage a video record`);
        if (promotion.media?.embed?.id !== video.providerVideoId)
          fail(
            `${where}: stages video "${video.id}" but embeds "${promotion.media?.embed?.id}" — they are different videos`,
          );
        if (promotion.media?.duration !== video.duration)
          fail(
            `${where}: publishes runtime "${promotion.media?.duration}" against the record's "${video.duration}"`,
          );
        if (promotion.media?.src !== video.poster.src)
          fail(`${where}: uses a different poster from the video record`);
        if (promotion.publishedAt !== video.publishedAt)
          fail(`${where}: publishes a different date from the video record`);
        if (!(promotion.action?.href ?? "").includes(video.providerVideoId))
          fail(`${where}: the action does not send the reader to the staged video`);
        if (!promotion.systemSlugs?.includes(video.systemSlug))
          fail(`${where}: does not route into "${video.systemSlug}", the video's own system`);
      }
    }
    if (promotion.canonicalRecord) {
      if (!promotion.canonicalRecord.startsWith("/"))
        fail(`${where}: canonicalRecord must be an internal route`);
      const slug = promotion.canonicalRecord.replace(/^\/newsroom\//, "");
      if (promotion.canonicalRecord.startsWith("/newsroom/") && !entrySlugs.has(slug))
        fail(`${where}: canonicalRecord points at a newsroom record that does not exist`);
    }

    checkDate(promotion.publishedAt, `${where} publishedAt`);
    checkVerification(promotion, where);

    checkAction(promotion.action, `${where} action`, actionIds);
    if (promotion.action && !promotion.action.id?.startsWith("promo:"))
      fail(`${where}: action id must be namespaced "promo:"`);

    // A promotion may never promise more than the system's state supports.
    const primary = systems.find((s) => s.slug === promotion.systemSlugs?.[0]);
    if (promotion.action?.type === "open-product" && primary && primary.status !== "Operating")
      fail(`${where}: offers an open-product action for a "${primary.status}" system`);

    // A snapshot is always dated, and only a live signal carries a value.
    if (promotion.format === "live-signal" && !promotion.signal)
      fail(`${where}: a live signal must carry its value`);
    if (promotion.signal && promotion.format !== "live-signal")
      fail(`${where}: only a live-signal promotion may carry a signal value`);
    if (promotion.signal) {
      const signal = promotion.signal;
      for (const field of ["metric", "value"]) {
        if (!signal[field]) fail(`${where} signal: missing ${field}`);
      }
      if (!["snapshot", "rollup"].includes(signal.reading))
        fail(`${where} signal: invalid reading "${signal.reading}"`);
      if (typeof signal.snapshot !== "boolean")
        fail(`${where} signal: does not state whether the value is a snapshot`);
      // The two fields cannot disagree: `snapshot` is the reading, restated.
      if (signal.snapshot !== (signal.reading === "snapshot"))
        fail(`${where} signal: reading "${signal.reading}" contradicts snapshot=${signal.snapshot}`);

      if (signal.reading === "snapshot") {
        // The original guard, unchanged: a moving reading carries its date.
        if (!signal.asOf) fail(`${where} signal: a snapshot has no as-of date`);
        checkDate(signal.asOf, `${where} signal asOf`);
      } else if (signal.asOf) {
        // And its counterpart: a standing figure was never frozen, so dating
        // it would attach a timestamp to something that has none.
        fail(`${where} signal: a rollup carries an as-of date it cannot have`);
      }

      // A rollup is published at a threshold, not to the digit, so the exact
      // moving value never enters the record in the first place.
      if (signal.reading === "rollup" && /\d[\d,.]*\.\d{2,}/.test(signal.value))
        fail(`${where} signal: a rollup publishes a precise moving figure — "${signal.value}"`);
    }

    if (promotion.media) {
      const media = promotion.media;
      if (!MEDIA_KINDS.includes(media.kind))
        fail(`${where} media: invalid kind "${media.kind}"`);
      if (!media.src) fail(`${where} media: no source`);
      if (typeof media.alt !== "string")
        fail(`${where} media: alternative text is required (use "" for a decorative image)`);
      checkLocalAsset(media.src ?? "", `${where} media`);
      if (media.poster) checkLocalAsset(media.poster, `${where} media poster`);
      if (media.fit && !["contain", "cover"].includes(media.fit))
        fail(`${where} media: invalid fit "${media.fit}"`);

      // An embed plays a specific video in place. The id it plays and the
      // destination the promotion publishes must be the same video, or the
      // page would play one thing and link to another.
      if (media.embed) {
        const embed = media.embed;
        if (embed.provider !== "youtube")
          fail(`${where} media embed: unsupported provider "${embed.provider}"`);
        if (!/^[A-Za-z0-9_-]{6,20}$/.test(embed.id ?? ""))
          fail(`${where} media embed: "${embed.id}" is not a video id`);
        const href = promotion.action?.href ?? "";
        if (embed.id && !href.includes(embed.id))
          fail(
            `${where} media embed: plays "${embed.id}" but the action links to "${href}" — a reader would be sent to a different video`,
          );
        if (promotion.format !== "video-episode")
          fail(`${where} media embed: only a video promotion may carry a playable embed`);
      }
    }
    if (promotion.sourceUrl) checkLocalAsset(promotion.sourceUrl, `${where} sourceUrl`);

    // A video or audio promotion is only ever published with real playable
    // media behind it. No Sagitta recording exists yet, so the stage stays
    // empty rather than being filled with a poster for nothing.
    if (["video-episode", "audio-briefing"].includes(promotion.format) && !promotion.media?.src)
      fail(`${where}: a recorded format needs a real poster or episode art`);
  }

  for (const promotion of activePromotions) {
    if (!isLive(promotion)) fail(`promotion "${promotion.id}": leaked into activePromotions`);
    if (promotion.state !== "active")
      fail(`promotion "${promotion.id}": archived promotion is being rendered`);
    if (promotion.verification.status !== "verified")
      fail(`promotion "${promotion.id}": an active promotion must be verified`);
  }

  // ── Homepage density ───────────────────────────────────────────────────────
  //
  // The rules the front page is built on, enforced where the content is rather
  // than trusted to the template: one dominant item above the fold, one product
  // moment, one video playing with the rest queued, one lead on the desk with
  // three rows behind it.
  //
  // Every maximum here is what the page can actually render, not a looser
  // editorial preference. That matters because the page slices each placement
  // to its own limit: a cap above the slice would let a promotion pass
  // validation and then silently never appear, which is the worst failure this
  // file can allow — a green build hiding a missing story. `network-headlines`
  // was 5 against a page that renders 4, and is now 4.
  const DENSITY = {
    "lead-carousel": { min: 3, max: 5 },
    "signal-strip": { min: 3, max: 5 },
    "product-feature": { min: 0, max: 1 },
    "video-feature": { min: 0, max: 4 },
    "network-headlines": { min: 0, max: 4 },
    "cinematic-feature": { min: 0, max: 1 },
  };

  for (const [placement, { min, max }] of Object.entries(DENSITY)) {
    const staged = promotionsAt(placement);
    if (staged.length < min)
      fail(`promotions: placement "${placement}" has ${staged.length} active, needs at least ${min}`);
    if (staged.length > max)
      fail(`promotions: placement "${placement}" has ${staged.length} active, at most ${max} may render`);

    const priorities = staged.map((p) => p.priority);
    if (new Set(priorities).size !== priorities.length)
      fail(`promotions: placement "${placement}" has two promotions at the same priority`);
  }

  const activeFormats = new Set(activePromotions.map((p) => p.format));
  if (activeFormats.size < 4)
    fail(`promotions: only ${activeFormats.size} formats are active — the front page needs 4 to 6`);
  if (activeFormats.size > 6)
    fail(`promotions: ${activeFormats.size} formats are active — no more than 6 may compete`);

  // The system count is the directory's to publish. It is not a slogan.
  for (const promotion of promotions) {
    for (const text of publicStrings(promotion)) {
      if (/\b(eight|8|ten|10)\s+systems\b/i.test(text))
        fail(`promotion "${promotion.id}": restates the system count — /systems owns it`);
    }
  }

  // Four external channels, at least three of them carrying a homepage
  // promotion, so the front page reads as a network rather than one feed.
  const activeChannelSet = new Set(activePromotions.map((p) => p.channel));
  const externalActive = ["x", "linkedin", "youtube", "paragraph"].filter((c) =>
    activeChannelSet.has(c),
  );
  if (externalActive.length < 3)
    fail(
      `promotions: only ${externalActive.length} external channels are on the homepage — at least 3 are required`,
    );

  // ── Corrections this pass locked in ────────────────────────────────────────
  //
  // Three model corrections have to hold in public copy, not only in the
  // records, so each is swept for across everything a reader could see.
  const CORRECTIONS = [
    {
      pattern: /\bTreasury\s+Decision\s+Desk\b/i,
      problem: "names the Treasury Decision Desk, which is not a Sagitta product",
    },
    {
      pattern: /\bSelun\s+x402\b\s+(?:is\s+a\s+system|system)\b/i,
      problem: "describes Selun x402 as a system rather than a capability of Selun",
    },
    {
      pattern: /\bSagitta\s+Wallet\b[^.]{0,60}\bis\s+operating\b/i,
      problem: "presents Sagitta Wallet as operating",
    },
  ];
  const sweptCollections = [
    ["systems", systems],
    ["capabilities", capabilities],
    ["newsroom", newsroomEntries],
    ["roadmap", roadmapItems],
    ["promotions", promotions],
    ["channels", promotionChannelRecords],
    ["artifacts", evidenceArtifacts ?? []],
    ["videos", videos ?? []],
    ["press resources", pressSections.flatMap((s) => s.resources)],
    ["press statistics", pressStatistics],
    ["site", [content.site, ...content.identityHierarchy, ...content.audienceRoutes]],
  ];
  for (const [name, records] of sweptCollections) {
    for (const record of records) {
      if (record.visibility === "internal") continue;
      for (const text of publicStrings(record)) {
        for (const { pattern, problem } of CORRECTIONS) {
          if (pattern.test(text)) fail(`${name}: public copy ${problem} — "${text.slice(0, 90)}…"`);
        }
      }
    }
  }

  // Every Protocol state claim keeps "Testnet" attached to the network name.
  for (const [name, records] of sweptCollections) {
    for (const record of records) {
      if (record.visibility === "internal") continue;
      for (const text of publicStrings(record)) {
        // Prose only: slugs, routes, and URLs are identifiers, not claims.
        if (!/\s/.test(text) || /^(https?:\/\/|\/)/.test(text)) continue;
        for (const network of ["Moonbase Alpha", "Arc"]) {
          const bare = new RegExp(
            `\\b(launched|live|deployed|deployment|active)\\b[^.]{0,40}\\b${network}\\b(?!\\s+Testnet)`,
            "i",
          );
          if (bare.test(text))
            fail(`${name}: a ${network} state claim drops "Testnet" — "${text.slice(0, 90)}…"`);
        }
      }
    }
  }

  // ── The coverage inventory ─────────────────────────────────────────────────
  //
  // The editorial planning record has to stay in step with the model: every
  // format and every decision lens must appear in it, so a format cannot be
  // added to the type layer and left unplanned.
  const coveragePath = path.join(ROOT, "PROMOTION_COVERAGE.md");
  if (!existsSync(coveragePath)) {
    fail("PROMOTION_COVERAGE.md is missing — the promotion inventory is not recorded");
  } else {
    const coverage = readFileSync(coveragePath, "utf8");
    for (const format of promotionFormats) {
      if (!coverage.includes(format.label))
        fail(`PROMOTION_COVERAGE.md: format "${format.label}" is not covered`);
    }
    for (const lens of decisionLenses) {
      if (!coverage.includes(lens.label))
        fail(`PROMOTION_COVERAGE.md: decision lens "${lens.label}" is not mapped`);
    }
    for (const state of ["Ready", "Evidence-ready", "Production needed", "Not useful"]) {
      if (!coverage.includes(state))
        fail(`PROMOTION_COVERAGE.md: readiness state "${state}" is never used`);
    }
  }

  // ── People ─────────────────────────────────────────────────────────────────
  //
  // Sagitta Systems publishes exactly one leadership profile. The Sagitta Labs
  // aliases live in a separate array that nothing renders; the check below fails
  // if either name reappears in the people collection.
  const ALIASES = ["Orion Gray", "Alexander Roth"];

  for (const person of people) {
    const where = `person "${person.slug}"`;
    checkVerification(person, where);
    if (!person.pressBio) fail(`${where}: missing press biography`);
    if (person.photo) checkLocalAsset(person.photo, `${where} photo`);
    if (ALIASES.includes(person.name))
      fail(`${where}: "${person.name}" is a Sagitta Labs alias, not Sagitta Systems leadership`);
    if (isLive(person) && person.verification.status !== "verified")
      fail(`${where}: a published leadership profile must be owner-confirmed`);
  }

  if (people.length !== 1)
    fail(`people: expected exactly 1 leadership profile, found ${people.length}`);
  if (sagittaLabsAliases.length === 0)
    fail("people: Sagitta Labs aliases are not recorded — provenance would be lost");

  // ── Report ─────────────────────────────────────────────────────────────────
  if (problems.length > 0) {
    console.error(`Content validation failed (${problems.length} problems):`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  console.log(
    [
      "Content validation passed:",
      `  ${systemCount} public systems across ${FAMILIES.length} families`,
      `  ${publicCapabilities.length} current + ${archivedCapabilities.length} archived supporting capabilities (excluded from the system count)`,
      `  ${people.length} public leadership profile, ${sagittaLabsAliases.length} Sagitta Labs aliases held outside the hub`,
      `  ${publishedEntries.length}/${newsroomEntries.length} newsroom records published`,
      `  ${desks.filter((d) => d.state === "active").length}/${desks.length} editorial desks active`,
      `  ${publicCareers.length} public roles, ${openCareers.length} open with published terms`,
      `  ${publicRoadmapItems.length} public roadmap items across Now / Next / Horizon`,
      `  ${pressStatistics.length} sourced statistics`,
      `  ${actionIds.size} state-aware calls to action, all uniquely identified`,
      `  ${cores.length} core systems, ${services.length} attached services, ${concepts.length} concept-stage`,
      `  ${publicSystems.length} stated ecosystem contributions, ${flow ? flow.surfaces.length : 0} commercial surfaces feeding the Protocol`,
      `  ${activePromotions.length}/${promotions.length} promotions active across ${activeFormats.size} formats`,
      `  ${externalActive.length} external channels on the homepage (${externalActive.join(", ")})`,
      `  ${promotionChannelRecords.filter((c) => c.active).length}/${promotionChannelRecords.length} channels active`,
      `  ${(publicArtifacts ?? []).length} evidence artifacts, each classified by what it proves`,
      `  ${(publicVideos ?? []).length} canonical video records, each resolved rather than copied by its placements`,
      `  ${promotionFormats.length} promotional formats modelled, ${decisionLenses.length} decision lenses mapped`,
      `  ${content.systemEdges.length} network edges, each with a stated reason`,
      `  no product-level Labs attribution in public copy`,
      `  ${entrySlugs.size} unique newsroom slugs, all relationships resolve`,
    ].join("\n"),
  );
}

try {
  main();
} catch (error) {
  console.error("Content validation could not run:", error);
  process.exit(1);
}
