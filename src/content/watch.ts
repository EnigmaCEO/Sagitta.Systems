import type { ContentAction, RecordBase } from "./types";

// The Watch stage.
//
// The homepage carries a permanent cinematic stage between the product moment
// and the network desk. It has two truthful states, and the state is decided by
// the promotion collection rather than by this file:
//
//   published    — a verified `video-feature` promotion exists. The stage shows
//                  the real episode: verified poster, play treatment, series,
//                  destination, and the duration the source publishes.
//   forthcoming  — no verified episode exists. The stage presents the programme
//                  itself as forthcoming editorial programming.
//
// The forthcoming state is a programme announcement, not a simulated player. It
// carries no play control, no duration, no view count, no episode link, and no
// YouTube destination, because none of those things exist yet. Its imagery is
// approved Sagitta Defense artwork and its destination is the Defense system
// record — a page that already exists — rather than an invented episode URL.
//
// As of 2026-07-31 the stage is in its published state: the Selun introduction
// on the Sagitta Labs YouTube channel entered the promotion collection at
// `video-feature`, so the stage switched on its own and this record stopped
// rendering. It is kept, and kept accurate, because it is still true — the
// Sagitta Defense Review programme is announced and has published no episode.
// The Selun video is not a Defense Review episode and is never presented as
// one; the two are unrelated, and conflating them is exactly what this record
// exists to prevent. If the stage ever needs a truthful forthcoming item again,
// it is here and it is current.

/** A programme Sagitta has announced but not yet published an episode of. */
export interface ForthcomingProgramme extends RecordBase {
  id: string;
  /** The stage's own label. */
  stageLabel: string;
  /** The programme name, as it will be published. */
  programme: string;
  /** Which editorial desk the programme belongs to. */
  desk: string;
  /** Truthful status. Never a date, because none has been published. */
  status: string;
  /** One line on what the programme will cover. */
  premise: string;
  /**
   * Short factual lines about the programme's subject, each drawn from a
   * surface that already publishes it. Never episode metadata.
   */
  standfirst: string[];
  /** Approved Sagitta artwork. */
  poster: { src: string; alt: string };
  /**
   * Where the stage may send a reader today. Present only because a real
   * Sagitta Defense page exists; it is never an episode destination.
   */
  action: ContentAction;
}

export const forthcomingProgramme: ForthcomingProgramme = {
  id: "sagitta-defense-review",
  stageLabel: "Watch",
  programme: "Sagitta Defense Review",
  desk: "Defense Review",
  status: "First episode forthcoming",
  premise:
    "The programme behind the review: how authority, treasury control, and oracle dependency actually fail, read from the incidents the Continuity Engine tracks.",
  standfirst: [
    "Authority surface, treasury control, oracle dependency",
    "Read from Sagitta Continuity Engine intelligence",
    "No published episode yet",
  ],
  poster: {
    src: "/defense-review.jpg",
    alt:
      "Sagitta Defense programme artwork: the gold shield and violet infinity mark held above a radar field, against a deep-space horizon.",
  },
  action: {
    id: "promo:sagitta-defense-review:system-record",
    label: "Read the Defense system record",
    href: "/systems/sagitta-defense",
    type: "evidence",
    availability: "available",
    audience: "Protocol teams, DAOs, and treasury operators",
  },
  verification: {
    status: "verified",
    source: "public/defense-review.jpg (Sagitta Defense hero artwork) + /systems/sagitta-defense",
    lastVerifiedAt: "2026-07-29",
    note:
      "The programme is announced, not published. Nothing here states an episode, a date, a runtime, or a video destination — the only claim made is that the first episode is forthcoming, and the only destination is a Sagitta page that already exists. Re-checked 2026-07-31: still accurate. The Selun video published on 2026-03-28 is a Selun product introduction on the Sagitta Labs channel and has no relationship to this programme, so it does not make the Defense Review programme published.",
  },
  publicationState: "upcoming",
  visibility: "public",
};

// ── The Selun product moment ────────────────────────────────────────────────
//
// The product stage renders Selun as a working decision surface rather than as a
// mark on a plinth. Every label below is read from the production wizard at
// AAA/SelunAgent/app/wizard/page.tsx — the same constants the deployed interface
// renders from — so the composition is the real interface's structure rather
// than an invented screenshot.
//
// What it is is stated in the caption: a rendering of the wizard's own steps and
// controls, not a capture of a session. No allocation, holding, percentage,
// result, or portfolio value is shown, because those are produced per reader by
// the live run and Sagitta publishes none of them here.

export interface InterfaceControl {
  /** The control's label, exactly as the wizard renders it. */
  label: string;
  /** Its options, in the wizard's own order. */
  options: string[];
  /** Which option the interface opens on. */
  initial: string;
}

export interface InterfaceStage {
  /** The step key the wizard uses internally. */
  key: string;
  /** The step label the reader sees. */
  label: string;
}

export interface ProductInterface extends RecordBase {
  id: string;
  /** The surface this composition is built from. */
  surface: string;
  /** What the reader is looking at. Rendered, never implied. */
  caption: string;
  /** The wizard's opening question, as it is written. */
  prompt: string;
  controls: InterfaceControl[];
  /** The portfolio segments the wizard offers, in its own order. */
  segments: { title: string; summary: string; volatility: string; examples: string[] }[];
  /** The seven processing steps the wizard runs, in order. */
  stages: InterfaceStage[];
  /** The step the composition holds at, so the interface reads as running. */
  activeStage: string;
  /** Settlement paths the interface offers at the end of a run. */
  settlement: string[];
}

export const selunInterface: ProductInterface = {
  id: "selun-allocation-wizard",
  surface: "selun.sagitta.systems/wizard",
  caption:
    "The Selun allocation wizard's own steps and controls, rendered from the production interface. Not a session capture — no allocation is shown, because each run produces its own.",
  prompt: "Choose your risk tolerance, investment timeframe, and preferred portfolio segment.",
  controls: [
    {
      label: "Risk Tolerance",
      options: ["Conservative", "Balanced", "Growth", "Aggressive"],
      initial: "Balanced",
    },
    {
      label: "Investment Timeframe",
      options: ["<1 year", "1–3 years", "3+ years"],
      initial: "1–3 years",
    },
  ],
  segments: [
    {
      title: "Bluechips",
      summary: "Well-known, high-liquidity crypto leaders.",
      volatility: "Lower relative volatility",
      examples: ["BTC", "ETH", "SOL"],
    },
    {
      title: "Memecoins",
      summary: "Community-led tokens that move on attention and sentiment.",
      volatility: "High",
      examples: ["PEPE", "WIF", "FLOKI"],
    },
    {
      title: "Gaming",
      summary: "Tokens tied to gaming ecosystems and player-driven economies.",
      volatility: "Moderate to High",
      examples: ["IMX", "RON", "GALA"],
    },
    {
      title: "Yield Farm",
      summary: "Tokens linked to staking, lending, and income-focused strategies.",
      volatility: "Stable to Moderate",
      examples: ["AAVE", "LDO", "GMX"],
    },
  ],
  stages: [
    { key: "SIGNAL_PULL", label: "Reviewing Market Condition" },
    { key: "REGIME_CLASSIFICATION", label: "Determining Allocation Policy" },
    { key: "ASSET_EXPANSION", label: "Expanding Eligible Asset Universe" },
    { key: "ASSET_SCREENING", label: "Screening for Liquidity & Structural Stability" },
    { key: "ASSET_SELECTION", label: "Evaluating Asset Risk & Quality" },
    { key: "ALLOCATION_CONSTRUCTION", label: "Constructing Portfolio Allocation" },
    { key: "REPORT_GENERATION", label: "Preparing Certified Decision Report" },
  ],
  activeStage: "ASSET_SCREENING",
  settlement: ["Card checkout", "Onchain USDC", "Certified decision report"],
  verification: {
    status: "verified",
    source: "AAA/SelunAgent/app/wizard/page.tsx (RISK_MODES, PORTFOLIO_SEGMENT_METADATA, PROCESSING_STEPS) + https://selun.sagitta.systems",
    lastVerifiedAt: "2026-07-29",
    note:
      "Labels, option sets, segment copy, and the seven processing steps are read from the production wizard's own constants rather than transcribed from a screenshot. No output values are published: the composition shows the interface, never a result.",
  },
  publicationState: "published",
  visibility: "public",
};
