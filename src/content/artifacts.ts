import type { EvidenceArtifact, Verification } from "./types";

// Evidence artifacts — the documents, diagrams, and system outputs the network
// can actually show.
//
// The point of this file is classification. A repository full of PDFs proves
// nothing on its own: what matters is what each one establishes, and the four
// kinds below are not interchangeable.
//
//   architecture-brief  — a description of how something is designed. It proves
//                         intent and structure. It does not prove that anything
//                         was built, integrated, or run.
//   sample-output       — a specimen of a real deliverable, produced on sample
//                         or illustrative input. It proves the shape of the
//                         output. It is not a customer result and carries no
//                         client's name.
//   research-document   — a published research or doctrine document.
//   executed-result     — an outcome from a real engagement. None is recorded
//                         here, because none has been published.
//
// A preview image is only ever rendered from the artifact itself. Where no
// page can be rendered from the real file, the artifact carries no preview
// rather than borrowing a mark to stand in for one.
//
// Checked 2026-07-31 against the repository and the public Sagitta surfaces.

const VERIFIED_ON = "2026-07-31";

function verified(source: string, note?: string): Verification {
  return { status: "verified", source, lastVerifiedAt: VERIFIED_ON, note };
}

export const evidenceArtifacts: EvidenceArtifact[] = [
  {
    id: "banking-account-to-treasury-lifecycle",
    title: "Sagitta Banking account-to-treasury lifecycle",
    kind: "architecture-brief",
    medium: "diagram",
    systemSlug: "sagitta-banking",
    proves:
      "That the deposit lifecycle — deposit, settle, execute, return — is specified end to end around a single control layer, and that the rail from core banking through USDC and Arc to treasury is designed rather than assumed. It does not evidence a live integration: Sagitta Banking is in development.",
    publicUrl: "https://banking.sagitta.systems",
    sourcePath: "public/banking-lifecycle.webp",
    preview: {
      src: "/banking-lifecycle.webp",
      alt:
        "The Sagitta Banking lifecycle diagram: deposit, settle, execute, and return arranged around a central Sagitta control layer, above a rail running core banking to USDC to Arc to treasury.",
      kind: "diagram",
    },
    promotionReadiness: "ready",
    verification: verified(
      "https://banking.sagitta.systems/hero-lifecycle-diagram.webp (published; HTTP 200) + Banking/public/hero-lifecycle-diagram.webp",
      "The published Sagitta Banking lifecycle diagram, carried into this repository unchanged so the homepage does not depend on a third-party host at render time. Classified as an architecture brief: it shows a designed control surface, not an executed integration. No Mifos or Apache Fineract integration document is present in this repository — the Banking product surface references Fineract, but no such document exists to classify, so none is registered.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "defense-sample-review",
    title: "Sample Defense Review report",
    kind: "sample-output",
    medium: "pdf",
    systemSlug: "sagitta-defense",
    proves:
      "The structure and methodology of the Defense Review deliverable — what a review examines and how findings are presented. It is a specimen, not an engagement outcome, and it names no client.",
    publicUrl: "https://defense.sagitta.systems/sample-review.pdf",
    sourcePath: "Defense/public/sample-review.pdf",
    promotionReadiness: "ready",
    verification: verified(
      "https://defense.sagitta.systems/sample-review.pdf (HTTP 200) + defense.sagitta.systems links to it as the sample report",
      "Publicly downloadable from the Defense service page. No page count is recorded: the file was not paginated here, and a count would have to be read rather than estimated. No preview is registered for the same reason — no page has been rendered from the real PDF, and a system mark would not be one. Classified as a sample output: presenting it as a case study would turn a specimen into a customer result.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "protocol-architecture-diagram",
    title: "Sagitta Protocol capital architecture diagram",
    kind: "architecture-brief",
    medium: "diagram",
    systemSlug: "sagitta-protocol",
    proves:
      "How capital moves through the protocol: deposits into the Vault, liquidity through the Treasury, the gold-backed Reserve, Escrow as the interface to external venues, and AAA and SCE governing allocation and continuity.",
    publicUrl: "/diagram.webp",
    sourcePath: "public/diagram.png",
    preview: {
      src: "/diagram.webp",
      alt:
        "The Sagitta Protocol capital architecture diagram, tracing deposits through the Vault, Treasury, Reserve, and Escrow.",
      kind: "diagram",
    },
    promotionReadiness: "ready",
    verification: verified(
      "public/diagram.png in this repository",
      "Pre-existing Sagitta material, cleared for press use and listed in the media library. An architecture description, not a record of deployed state.",
    ),
    publicationState: "published",
    visibility: "public",
  },
  {
    id: "protocol-whitepaper",
    title: "Sagitta whitepaper",
    kind: "research-document",
    medium: "web-document",
    systemSlug: "sagitta-protocol",
    proves:
      "The protocol's architecture, doctrine, and capital-flow design as published in full — the Vault, Treasury, Reserve, and Escrow, with the Allocation Agent and the Continuity Engine as components rather than integrations.",
    publicUrl: "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
    promotionReadiness: "ready",
    verification: verified(
      "https://sagitta-protocol.gitbook.io/sagitta-whitepaper",
      "Executive summary and component set read directly. The document states no version and no publication date, so this record carries neither — `dated` is absent rather than filled from the hosting platform.",
    ),
    publicationState: "published",
    visibility: "public",
  },
];

// ─── Queries ─────────────────────────────────────────────────────────────────

export const publicArtifacts = evidenceArtifacts.filter(
  (a) => a.visibility === "public" && a.publicationState === "published",
);

export function getArtifact(id: string): EvidenceArtifact | undefined {
  return evidenceArtifacts.find((a) => a.id === id);
}

export function artifactsForSystem(slug: string): EvidenceArtifact[] {
  return publicArtifacts.filter((a) => a.systemSlug === slug);
}

/** Human-readable labels. Rendered wherever an artifact's kind is shown. */
export const artifactKindLabels: Record<EvidenceArtifact["kind"], string> = {
  "architecture-brief": "Architecture brief",
  "sample-output": "Sample output",
  "research-document": "Research document",
  "business-case": "Business case",
  "executed-result": "Executed result",
};
