// Shared content types for the Sagitta Systems institutional hub.
//
// Phase 2 adds a truth layer on top of the Phase 1 structure. Every public
// record carries:
//
//   - a `verification` block  — how the claim is sourced and when it was checked
//   - a `publicationState`    — published / upcoming / draft / archived
//   - a `visibility`          — whether the record may appear in public feeds
//
// The rule enforced by scripts/check-content.mjs: only records that are
// `published` AND `public` may appear in public feeds, counts, or directories.
// Anything provisional or pending stays internal and is tracked in
// CONTENT_AUDIT.md rather than becoming public filler.

// ─── Shared ──────────────────────────────────────────────────────────────────

/** Evidence-based state shared by systems, capabilities and roadmap items. */
export type OperatingState =
  | "Operating"
  | "Public Test"
  | "In Development"
  | "Research Horizon";

/**
 * Where a system sits in the ecosystem's architecture.
 *
 * `core`    — a foundation other systems are built on or attached to.
 * `service` — a system delivered on top of exactly one core foundation.
 * `concept` — a system at concept or research stage, with no attachment yet.
 *
 * A service carries `parentSystem`; a core and a concept never do. All three
 * kinds are systems in the promotional layer, because each has its own
 * identity, activity, audience, and destination — the kind records the
 * architecture, it does not demote anything.
 */
export type SystemKind = "core" | "service" | "concept";

/** How well a claim is sourced. Only `verified` material is published. */
export type VerificationStatus = "verified" | "provisional" | "pending";

/** Editorial lifecycle of a record. */
export type PublicationState = "published" | "upcoming" | "draft" | "archived";

/** Whether a record may be rendered publicly at all. */
export type Visibility = "public" | "internal";

export interface Verification {
  status: VerificationStatus;
  /** Where the claim comes from. A URL, or a repository path. */
  source?: string;
  /** ISO date the source was last checked. */
  lastVerifiedAt: IsoDate;
  /** Internal editorial note. Never rendered publicly. */
  note?: string;
}

export interface Link {
  label: string;
  href: string;
  /** Leaves the site — rendered with target/rel and an external affordance. */
  external?: boolean;
}

// ─── Conversion ──────────────────────────────────────────────────────────────
//
// Phase 3 replaces generic "Learn more" calls to action with actions derived
// from each system's real state and real public destination. Every action
// carries a stable `id` so future analytics can measure the path without a new
// vendor being introduced now: the id is emitted as a `data-cta` attribute and
// nothing reads it at runtime.

/** What kind of journey the action starts. Drives analytics grouping. */
export type ActionType =
  | "open-product"
  | "documentation"
  | "evidence"
  | "demonstration"
  | "defense-review"
  | "partnership"
  | "roadmap"
  | "research"
  | "press"
  | "career"
  | "system-entry"
  | "contact";

/**
 * Whether the destination can be used right now, has to be arranged, or is
 * documentation of something not yet built. Never inferred — it is stated.
 */
export type ActionAvailability = "available" | "by-request" | "documented";

export interface ContentAction {
  /** Stable analytics identifier, e.g. "system:sagitta-radar:open". */
  id: string;
  /** Destination-led label. Never "Learn more". */
  label: string;
  href: string;
  external?: boolean;
  type: ActionType;
  availability: ActionAvailability;
  /** Who the action is for, when that is not obvious from the label. */
  audience?: string;
  /** One short qualifier rendered beside the action. */
  note?: string;
}

/** ISO-8601 date string (YYYY-MM-DD), or null when no verified date exists. */
export type IsoDate = string | null;

/** Fields every public content record carries. */
export interface RecordBase {
  verification: Verification;
  publicationState: PublicationState;
  visibility: Visibility;
}

// ─── Promotions ──────────────────────────────────────────────────────────────
//
// Phase 4 turns the homepage into a promotional front page. A promotion is not a
// new fact: it is a current reason to enter a system, assembled from material
// that already exists on the record. Three concepts are deliberately kept apart:
//
//   format       — what kind of promotional subject it is
//   channel      — where the source or destination lives
//   placement    — how the homepage stages it
//
// Editorial selection controls placement and order through `priority`. Date does
// not choose the lead story.

/** The thirteen promotional formats the model supports. */
export type PromotionFormat =
  /** 1 — a metric or signal read from a live surface. */
  | "live-signal"
  /** 2 — an alert, coverage change, or dated status check. */
  | "alert-status"
  /** 3 — a launch, deployment, or milestone. */
  | "launch-milestone"
  /** 4 — a product interface or a demonstration of one. */
  | "product-interface"
  /** 5 — a use case, or a portfolio's reaction to a market condition. */
  | "use-case"
  /** 6 — an article or a founder perspective. */
  | "article"
  /** 7 — a research report or data brief. */
  | "research-report"
  /** 8 — a post on a social channel. */
  | "social-post"
  /** 9 — a video episode. */
  | "video-episode"
  /** 10 — an audio briefing or podcast episode. */
  | "audio-briefing"
  /** 11 — a case study, published result, or customer testimony. */
  | "case-study"
  /** 12 — press or external coverage. */
  | "external-coverage"
  /** 13 — an event, interview, or presentation. */
  | "event-appearance";

/** Where the source material or the destination actually lives. */
export type PromotionChannel =
  | "sagitta-systems"
  | "sagitta-product"
  | "x"
  | "linkedin"
  | "youtube"
  | "paragraph"
  | "external-publication";

/** How the homepage stages a promotion. One stage per medium. */
export type PromotionPlacement =
  | "lead-carousel"
  | "signal-strip"
  | "product-feature"
  | "video-feature"
  | "network-headlines"
  | "cinematic-feature";

/**
 * The decision a reader is trying to make. This is editorial routing logic: it
 * decides which system a promotion should hand the reader to, and is never
 * rendered as a taxonomy on the homepage.
 */
export type DecisionLens =
  | "fund-allocation"
  | "policy-governance"
  | "sector-portfolios"
  | "defi-health"
  | "protocol-readiness"
  | "cve-defense"
  | "onchain-banking"
  | "crypto-functionality";

/**
 * What kind of picture this is. The kind is stated rather than inferred so a
 * system mark is never presented as a product screenshot, and a diagram is
 * never presented as a live interface.
 */
export type PromotionMediaKind =
  | "system-mark"
  | "diagram"
  | "constellation"
  | "report-cover"
  | "article-cover"
  | "product-screenshot"
  | "video-thumbnail"
  | "social-preview"
  | "audio-art";

/**
 * A source that permits inline playback.
 *
 * Recorded as a provider and an id rather than an embed URL, so the page builds
 * the privacy-enhanced URL itself and a raw third-party URL never enters the
 * content layer. The id must match the `action.href` the promotion already
 * publishes — the validator enforces it — so the thing that plays inline and
 * the thing the reader is sent to can never drift apart.
 */
export interface PromotionEmbed {
  provider: "youtube";
  /** The video id, e.g. "SHecO67AqfM". */
  id: string;
}

export interface PromotionMedia {
  kind: PromotionMediaKind;
  /** Asset in /public, or an approved poster URL. */
  src: string;
  /** Poster or thumbnail, where it differs from `src`. */
  poster?: string;
  /** Required. Describes the asset for what it is. */
  alt: string;
  /** Runtime as published by the source. Never estimated. */
  duration?: string;
  /** Present only where the source permits playing the media in place. */
  embed?: PromotionEmbed;
  /**
   * How the image should be staged. `contain` keeps a mark whole; `cover` lets
   * a composition fill its frame.
   */
  fit?: "contain" | "cover";
}

/**
 * What kind of reading a published figure is.
 *
 * `snapshot` — a point-in-time value that keeps moving. It is published with
 *              the date it was read and labelled a snapshot, so it is never
 *              mistaken for a current figure.
 * `rollup`   — a standing figure the operating surface itself keeps current,
 *              published at a threshold rather than to the digit. A rollup
 *              carries no as-of date, because inventing one would date a value
 *              that was never frozen.
 *
 * The distinction exists so a live product rollup and a dated reading are not
 * forced through the same shape. The snapshot guard is unchanged: a snapshot
 * still has to carry its date.
 */
export type SignalReading = "snapshot" | "rollup";

/** A published figure carried by a `live-signal` promotion. */
export interface PromotionSignal {
  metric: string;
  value: string;
  reading: SignalReading;
  /**
   * The date the value was read. Required for a `snapshot`, and always null
   * for a `rollup` — a standing figure has no as-of date to publish.
   */
  asOf: IsoDate;
  /**
   * True exactly when `reading` is `"snapshot"`. Kept as its own field so the
   * rule a snapshot is always labelled as one stays directly assertable.
   */
  snapshot: boolean;
}

export interface PromotionRecord extends RecordBase {
  /** Stable slug. Also the analytics prefix for the promotion's action. */
  id: string;
  format: PromotionFormat;
  channel: PromotionChannel;
  placement: PromotionPlacement;
  /** Systems this promotion routes into. First is primary. */
  systemSlugs: string[];
  /** Decision lenses this promotion serves. */
  lens: DecisionLens[];
  audience: string[];
  /** Capabilities the subject belongs to, where the routing system alone is
   * not the whole story — Selun x402 content, for instance, is Selun's. */
  capabilitySlugs?: string[];
  /** Short source or system label rendered above the headline. */
  eyebrow: string;
  /**
   * The canonical title, exactly as the source published it. This is the
   * record; it is never shortened in place.
   */
  headline: string;
  /**
   * An approved shorter headline for stages where the canonical title cannot
   * be set well. Rendering it is opt-in per stage, and the canonical
   * `headline` stays available to the reader wherever it is used.
   */
  displayHeadline?: string;
  /** At most one sentence. */
  context?: string;
  /** Publication date of the subject, where one is published. */
  publishedAt: IsoDate;
  /** Human-readable name of the source. */
  sourceName: string;
  /** The source, where it differs from the action's destination. */
  sourceUrl?: string;
  /** The one specific thing to do next. Reuses the site-wide action contract. */
  action: ContentAction;
  media?: PromotionMedia;
  signal?: PromotionSignal;
  /** Id of the evidence artifact this promotion is built on, where one exists. */
  artifactId?: string;
  /**
   * Route of the canonical record for this subject, where the newsroom holds
   * one. The promotion is a selection; this is where the full record lives.
   */
  canonicalRecord?: string;
  /** Editorial order within a placement. Lower comes first. */
  priority: number;
  /** `archived` promotions stay on the record but never render. */
  state: "active" | "archived";
}

// ─── Channels ────────────────────────────────────────────────────────────────

/**
 * A channel Sagitta actually publishes on, with the destination that proves
 * it. Held in data rather than in component markup so a channel label and a
 * channel URL cannot drift apart across the stages that render them.
 */
export interface PromotionChannelRecord extends RecordBase {
  id: PromotionChannel;
  /** Label rendered in an eyebrow or a source line. */
  label: string;
  /** The account or publication name, where the channel has one. */
  accountName?: string;
  /** The channel's own public home. Absent where no verified home exists. */
  url?: string;
  /** True when Sagitta currently publishes here. */
  active: boolean;
}

// ─── Evidence artifacts ──────────────────────────────────────────────────────
//
// PDFs, diagrams, and system outputs, classified by what each one actually
// proves. An architecture brief is not an implemented result and a sample
// output is not a customer testimony, so the kind is recorded rather than
// inferred from the fact that a document exists.

export type ArtifactKind =
  /** A design or architecture description of something built or being built. */
  | "architecture-brief"
  /** A specimen of a real deliverable, produced on sample or illustrative input. */
  | "sample-output"
  /** A published research or doctrine document. */
  | "research-document"
  /** A commercial or business case. */
  | "business-case"
  /** An executed result from a real engagement. */
  | "executed-result";

export type ArtifactMedium = "pdf" | "diagram" | "web-document" | "dataset";

export interface EvidenceArtifact extends RecordBase {
  id: string;
  /** Exact title, as the artifact itself carries it. */
  title: string;
  kind: ArtifactKind;
  medium: ArtifactMedium;
  /** Slug of the system the artifact belongs to. */
  systemSlug: string;
  /** What the artifact actually establishes. Never overstated. */
  proves: string;
  /**
   * When the artifact was created or published, and which of the two this is.
   * File-creation metadata is not a release date and is labelled `created`.
   */
  dated?: { date: IsoDate; basis: "published" | "created" };
  /** Public destination, where the artifact resolves publicly. */
  publicUrl?: string;
  /** Repository or internal path, where one exists. */
  sourcePath?: string;
  /** Pages, only where the count has actually been read. */
  pageCount?: number;
  /** A preview rendered from the artifact itself, never a stand-in for it. */
  preview?: { src: string; alt: string; kind: PromotionMediaKind };
  /** Whether the artifact is ready to carry a promotion. */
  promotionReadiness: "ready" | "evidence-ready" | "internal";
}

// ─── Systems ─────────────────────────────────────────────────────────────────

export type SystemFamilyId =
  | "continuity-defense"
  | "allocation-agent-intelligence"
  | "capital-infrastructure";

export interface SystemFamily {
  id: SystemFamilyId;
  name: string;
  summary: string;
  order: number;
  /** Short label for badges, legends, and constellation keys. */
  shortName: string;
  /**
   * Design-token suffix. `continuity` resolves to `--family-continuity` and
   * friends in globals.css, so a family's accent is defined once.
   */
  token: "continuity" | "allocation" | "capital";
  /**
   * The family's visual language, documented in VISUAL_DIRECTION.md.
   * `signal` — radar sweeps and protection arcs.
   * `intelligence` — routing, branching, decision paths.
   * `ledger` — settlement rails and capital flow.
   */
  motif: "signal" | "intelligence" | "ledger";
}

export interface SystemRecord extends RecordBase {
  slug: string;
  name: string;
  shortName: string;
  family: SystemFamilyId;
  /**
   * Architectural position. `core` foundations carry no parent; `service`
   * systems name the foundation they are attached to; `concept` systems are
   * not attached to anything yet.
   */
  systemKind: SystemKind;
  /** Slug of the core system this service is built on. Services only. */
  parentSystem?: string;
  /** One-sentence institutional description used on cards and directory rows. */
  summary: string;
  /**
   * What this system contributes to the Sagitta Protocol ecosystem.
   *
   * This is a *second* relationship, orthogonal to `family`, `systemKind`, and
   * `parentSystem`. Those three describe the internal architecture — which
   * foundation a system is built on and which strategic family it sells into —
   * and they remain correct. This field answers a different question: what
   * capability does this system build, prove, or commercialize on the
   * ecosystem's behalf.
   *
   * The two do not always agree, and that is the point. Sagitta Radar is a
   * service of the Continuity Engine architecturally, and a commercial surface
   * that funds and hardens continuity capability ecosystem-wide. Stating only
   * the first leaves the network reading as a portfolio that happened to emerge
   * together.
   *
   * Written as a single sentence in the active voice, naming the system as the
   * subject. Required on every public system, including concept-stage ones —
   * a system with no articulable contribution is a system with no reason to be
   * in the network.
   */
  ecosystemRole: string;
  /** What operating problem the system addresses. */
  problem: string;
  /** Fuller overview used on the detail template. */
  overview: string[];
  /** What a visitor can actually use or inspect today. */
  availableToday: string[];
  /** Intended audience. */
  audience: string[];
  status: OperatingState;
  /** Why the status is what it is, in one sentence. */
  statusEvidence: string;
  operatingUrl?: string;
  /** Host shown as a monospace hint on cards. */
  subdomain?: string;
  documentationUrl?: string;
  /** Evidence or demonstration links. */
  evidence: Link[];
  /** Slugs of supporting capabilities delivered through this system. */
  capabilitySlugs?: string[];
  /**
   * Conceptual links to other systems, each with the reason it exists. Only
   * relationships already stated in this record's own `overview` copy appear
   * here — the constellation draws the network, it does not invent it.
   */
  connections?: SystemConnection[];
  /** State-aware primary call to action. Required: every system has one. */
  primaryAction: ContentAction;
  /** Optional supporting action. */
  secondaryAction?: ContentAction;
  /**
   * Square-ish product mark in /public, for icon-scale use: the roadmap's mark
   * column, the newsroom lead rail, door cards. Anything rendered in a small
   * box assumes roughly 1:1 and will squash a wide asset, so a horizontal
   * lockup belongs in `wordmark` instead.
   */
  logo?: string;
  /**
   * Horizontal name lockup in /public — the mark and the system's name set
   * together, typically 3:1 or wider.
   *
   * Kept separate from `logo` because the two are not interchangeable: a
   * wordmark rendered at 34px wide is illegible, and a square mark stretched
   * across a lockup slot is wrong. A system may have either, both, or neither.
   */
  wordmark?: string;
  featured: boolean;
}

/** A stated relationship between two systems, used by the constellation. */
export interface SystemConnection {
  /** Slug of the related system. */
  slug: string;
  /** Why the link exists, in a few words. Rendered as accessible text. */
  reason: string;
  /**
   * The same relationship compressed to two or three words, for printing on the
   * wire in the network schematic. A restatement of `reason`, never a claim
   * `reason` does not already make. Omit it and the wire is drawn unlabelled.
   */
  shortReason?: string;
  /**
   * `structural` links are load-bearing — one system runs on or supplies the
   * other. `contextual` links are real but secondary, and are drawn faintly.
   */
  strength: "structural" | "contextual";
}

/**
 * A service or supporting capability. Not a peer system: capabilities are
 * delivered through one or more systems, carry no operating-status badge, and
 * are excluded from system counts.
 */
export interface CapabilityRecord extends RecordBase {
  slug: string;
  name: string;
  summary: string;
  overview: string[];
  audience: string[];
  /** Slugs of the systems that actually deliver this capability. */
  deliveredBy: string[];
  /** How to obtain it today. */
  accessPath: string;
  operatingUrl?: string;
  evidence: Link[];
  /** Present only where the capability is currently offered. */
  primaryAction?: ContentAction;
}

// ─── Newsroom ────────────────────────────────────────────────────────────────

export type DeskId =
  | "sce-wire"
  | "policy-notes"
  | "allocation-read"
  | "radar-report"
  | "defense-review"
  | "sagitta-podcast"
  | "words-from-the-architect"
  | "continuity-desk";

export interface EditorialDesk {
  id: DeskId;
  name: string;
  summary: string;
  /** Slug of the system this desk primarily covers, when applicable. */
  systemSlug?: string;
  /** Intended publishing rhythm. Describes the desk, never an unwritten entry. */
  cadence: string;
  /** Format the desk publishes in. */
  format: string;
  /** `active` once the desk has published; otherwise `upcoming`. */
  state: "active" | "upcoming";
}

export type MediaType =
  | "Article"
  | "Report"
  | "Audio"
  | "Video"
  | "Briefing"
  | "Press Release"
  | "Data"
  | "System Update";

export interface NewsroomEntry extends RecordBase {
  slug: string;
  title: string;
  summary: string;
  publishedAt: IsoDate;
  /** Complete source publication timestamp used by VideoObject.uploadDate. */
  videoUploadDate?: string;
  updatedAt: IsoDate;
  desk: DeskId;
  mediaType: MediaType;
  author: string;
  /** Slug of the primary related system. */
  systemSlug?: string;
  /** Additional related system slugs. */
  relatedSystems?: string[];
  heroImage?: string;
  /** The destination this record points at, if any. See `externalRole`. */
  externalUrl?: string;
  /**
   * What `externalUrl` actually is. Required wherever `externalUrl` is set, and
   * enforced by the content check.
   *
   * The field exists because the same property was carrying two unrelated
   * meanings. On the Paragraph, LinkedIn, YouTube, AAA research-note, and
   * whitepaper records it is the **canonical** publication: the full work lives
   * there and this page is the network's record of it. On the status checks,
   * launch milestones, and the architecture diagram it is a **reference** — the
   * product surface or asset the record is *about*, while the record itself is
   * original writing for which this page is canonical.
   *
   * Nothing renders differently either way; both still produce one external
   * action. What depends on it is structured data: `Article` markup is emitted
   * only for `reference` records, because claiming authorship on a page whose
   * canonical is somebody else's competes with the real one.
   */
  externalRole?: "canonical" | "reference";
  /** Label for the external action, e.g. "Read on aaa.sagitta.systems". */
  externalLabel?: string;
  /** Internal context, one string per paragraph. */
  body: string[];
  /**
   * Playable media. Present only where a real, verified source exists — the
   * audio and video components render nothing without it, so the capability
   * can ship ahead of the first recorded publication without inventing one.
   */
  media?: NewsroomMedia;
  featured: boolean;
}

export interface NewsroomMedia {
  kind: "audio" | "video";
  /** Native file in /public, or an approved embed URL. */
  src: string;
  /** `embed` sources are rendered in an iframe; `native` uses the media element. */
  delivery: "native" | "embed";
  /** Runtime as published by the source, e.g. "38 min". Never estimated. */
  duration?: string;
  /** Poster image for video. */
  poster?: string;
  /** Transcript or caption track, where one is published. */
  transcriptUrl?: string;
}

// ─── Careers ─────────────────────────────────────────────────────────────────

export type EngagementType =
  | "Commission-based"
  | "Contract / Contributor"
  | "On-call contractor"
  | "Future / Contract"
  | "Future workstream";

export type CareerStatus = "Open" | "Contributor" | "Future" | "Archived";

export interface CareerRecord extends RecordBase {
  slug: string;
  title: string;
  /** Slug of the system this role supports. */
  systemSlug?: string;
  engagement: EngagementType;
  status: CareerStatus;
  compensation: string;
  location: string;
  immediateResponsibility: string;
  firstDeliverable: string;
  requiredExperience: string[];
  applicationProcess: string;
  hiringContact: string;
  publishedAt: IsoDate;
  updatedAt: IsoDate;
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

export type RoadmapHorizon = "Now" | "Next" | "Horizon";

export interface RoadmapItem extends RecordBase {
  id: string;
  /** A specific milestone or capability, not a system name. */
  title: string;
  systemSlug?: string;
  state: OperatingState;
  horizon: RoadmapHorizon;
  summary: string;
  /** Supporting evidence for the stated position. */
  evidence?: Link;
  updatedAt: IsoDate;
  featured: boolean;
}

// ─── Press ───────────────────────────────────────────────────────────────────

export interface PressResource extends RecordBase {
  id: string;
  title: string;
  description: string;
  links: Link[];
}

export interface PressSection {
  id: string;
  title: string;
  description: string;
  resources: PressResource[];
}

/** A published figure. Every field is required — no unsourced numbers. */
export interface PressStatistic extends RecordBase {
  id: string;
  metric: string;
  value: string;
  /** What the figure covers and what it excludes. */
  scope: string;
  source: Link;
}

// ─── People ──────────────────────────────────────────────────────────────────

export interface Person extends RecordBase {
  slug: string;
  name: string;
  role: string;
  /** Short biography for cards. */
  bio: string;
  /** Press-length biography. */
  pressBio: string;
  /** Areas of experience, as published. */
  experience: string[];
  photo?: string;
  links: Link[];
}
