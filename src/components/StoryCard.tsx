import Image from "next/image";
import Link from "@/components/Link";
import { getDeskName } from "@/content/desks";
import { formatDateOrUndated } from "@/content";
import { getFamily, getSystem, getSystemName } from "@/content/systems";
import type { NewsroomEntry } from "@/content/types";
import { familyClass } from "./FamilyMark";
import MediaTypeBadge, { MediaTypeIcon, mediaTypeStyles } from "./MediaTypeBadge";
import SystemMark from "./SystemMark";
import { MediaMeta } from "./MediaPlayer";
import { ArrowRight, ExternalArrow } from "./icons";

/**
 * Newsroom card.
 *
 * The eight media types share one card system but do not look identical. What
 * varies is emphasis, not structure: a Report or Video leads with its visual
 * and gets a taller frame, a System Update reads as a technical record with a
 * monospace stamp and no image, and everything else sits between. The result is
 * an editorial grid with visible variety and one consistent set of rules.
 */
export default function StoryCard({
  entry,
  variant = "default",
}: {
  entry: NewsroomEntry;
  variant?: "default" | "lead" | "feature" | "compact";
}) {
  const systemName = getSystemName(entry.systemSlug);
  const family = entry.systemSlug ? getSystem(entry.systemSlug)?.family : undefined;
  const familyRecord = family ? getFamily(family) : undefined;
  const href = `/newsroom/${entry.slug}`;
  const accent = mediaTypeStyles[entry.mediaType].color;

  // Records that are documents or recordings earn a visual; status updates and
  // short reads do not, and forcing one on them would only add grey boxes.
  const visualFirst =
    Boolean(entry.heroImage) && ["Report", "Video", "Data", "Briefing"].includes(entry.mediaType);
  const isTechnical = entry.mediaType === "System Update";

  if (variant === "compact") {
    return (
      <article
        className={`${familyClass(family)} surface-card flex items-start justify-between gap-4 rounded-lg border p-4`}
        data-testid="story-card"
        data-media-type={entry.mediaType}
        data-desk={entry.desk}
      >
        <div className="min-w-0">
          <h3 className="text-sm font-semibold mb-1 leading-snug">
            <Link
              href={href}
              className="transition-opacity duration-150 hover:opacity-80"
              style={{ color: "var(--text-primary)" }}
            >
              {entry.title}
            </Link>
          </h3>
          <StoryMeta entry={entry} systemName={systemName} />
        </div>
        <span style={{ color: accent }} className="shrink-0 pt-0.5">
          <MediaTypeIcon type={entry.mediaType} size={15} />
          <span className="visually-hidden">{entry.mediaType}</span>
        </span>
      </article>
    );
  }

  const isLead = variant === "lead";
  const isFeature = variant === "feature";

  return (
    <article
      data-testid="story-card"
      data-media-type={entry.mediaType}
      data-desk={entry.desk}
      className={`${familyClass(family)} surface-card flex flex-col h-full rounded-xl border overflow-hidden ${
        isLead ? "md:flex-row" : ""
      }`}
      style={{ borderTop: `2px solid color-mix(in srgb, ${accent} 45%, transparent)` }}
    >
      {entry.heroImage && (visualFirst || isLead) ? (
        <div
          className={
            isLead
              ? "md:w-1/2 shrink-0 border-b md:border-b-0 md:border-r relative"
              : "border-b relative"
          }
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-raised)" }}
        >
          <Image
            src={entry.heroImage}
            alt=""
            width={800}
            height={450}
            sizes={isLead ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
            className="w-full h-full object-cover"
            style={{
              aspectRatio: isLead ? "4 / 3" : isFeature ? "16 / 9" : "3 / 2",
              maxHeight: isLead ? 340 : 220,
            }}
          />
        </div>
      ) : isLead && familyRecord ? (
        // The lead slot is chosen editorially, so it regularly lands on a record
        // that has no image — a status check or a launch milestone, which earn no
        // visual under the rules above and would otherwise leave the network's
        // headline as a wall of text.
        //
        // What fills it is the family's own motif, not a stand-in for a picture:
        // the same signal / routing / ledger geometry the system pages and family
        // sections already use. It is presentation metadata (CONTENT_AUDIT.md §9),
        // so it depicts nothing, claims nothing, and cannot become a simulated
        // product screenshot — which the promotion rules forbid outright.
        //
        // The whole panel is aria-hidden: the icon is decorative and the caption
        // repeats the system name that `StoryMeta` already publishes as a link.
        //
        // ── Why this is a 20% rail and not a half ───────────────────────────
        //
        // At half width with a fixed 4:3 box, a mark sat marooned in a large
        // empty field: the panel was sized for a photograph and filled with an
        // emblem. A mark is an identifier, not a picture, and it wants the space
        // a masthead gets rather than the space a hero image gets.
        //
        // So the rail takes a fifth, drops the aspect ratio, and stretches to
        // whatever height the story column sets. Nothing floats, because there
        // is no leftover room to float in. A real `heroImage` still gets the
        // half above — a photograph earns the space an emblem does not.
        <div
          aria-hidden="true"
          data-testid="story-motif"
          className="md:w-1/5 shrink-0 border-b md:border-b-0 md:border-r relative flex md:flex-col items-center justify-center gap-3 md:gap-4 overflow-hidden px-6 py-7 md:px-4"
          style={{
            borderColor: "var(--border)",
            // A flat fill read as an empty slot. A whisper of the family accent
            // makes the rail look chosen rather than left over.
            background:
              "linear-gradient(155deg, color-mix(in srgb, var(--family-accent) 9%, var(--bg-raised)), var(--bg-raised) 70%)",
          }}
        >
          {/* No `FamilyBackdrop` here on purpose. Its motif is drawn at 420px
              for a full-width section; in a rail this narrow it clips to an
              arbitrary arc rather than reading as geometry. The Radar mark also
              carries concentric rings of its own, so the two competed. The
              accent gradient does the same job without the noise. */}

          {/* Shared with the roadmap: the system's mark where one exists, the
              family motif where it does not. The rail scales its width with the
              viewport, so the size prop only sets the motif fallback's box. */}
          <SystemMark
            systemSlug={entry.systemSlug}
            height={76}
            width="100%"
            style={{ maxWidth: 132 }}
          />

          <span
            className="relative font-mono text-[0.6rem] uppercase tracking-[0.16em] leading-tight md:text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            {systemName ?? familyRecord.shortName}
          </span>
        </div>
      ) : null}

      <div className={`flex flex-col flex-1 ${isLead ? "p-6 md:p-8" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <MediaTypeBadge type={entry.mediaType} size={isLead ? "md" : "sm"} />
          {/* Only a record whose full text really is published elsewhere says so.
              This used to key off `externalUrl` alone, which made every launch
              milestone and status check claim to be someone else's publication —
              "Sagitta Radar launched" is original writing canonical to this site,
              and its external link is the product, not the article. `externalRole`
              is the field that tells the two apart. */}
          {entry.externalRole === "canonical" && entry.externalUrl?.startsWith("http") && (
            <span
              className="inline-flex items-center gap-1 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Published elsewhere
              <ExternalArrow size={10} />
            </span>
          )}
          <MediaMeta media={entry.media} />
        </div>

        <h3
          className={`font-semibold mb-2 leading-snug ${
            isLead ? "display text-xl md:text-2xl" : isFeature ? "text-base" : "text-sm"
          }`}
        >
          <Link
            href={href}
            data-cta={`story:${entry.slug}`}
            data-cta-type="research"
            className="transition-opacity duration-150 hover:opacity-80"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.title}
          </Link>
        </h3>

        <p
          className={`leading-relaxed flex-1 mb-4 ${isLead ? "text-sm md:text-base" : "text-xs"}`}
          style={{ color: "var(--text-secondary)" }}
        >
          {entry.summary}
        </p>

        <StoryMeta entry={entry} systemName={systemName} mono={isTechnical} />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity duration-150 hover:opacity-80"
            style={{ color: "var(--family-accent)" }}
          >
            {isLead ? "Read the record" : "Read record"}
            <ArrowRight size={12} />
          </Link>
          {entry.externalUrl && entry.externalLabel && (
            <a
              href={entry.externalUrl}
              target={entry.externalUrl.startsWith("http") ? "_blank" : undefined}
              rel={entry.externalUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              data-cta={`story-external:${entry.slug}`}
              data-cta-type="documentation"
              className="inline-flex items-center gap-1 text-xs font-medium transition-opacity duration-150 hover:opacity-80"
              style={{ color: "var(--text-tertiary)" }}
            >
              {entry.externalLabel}
              <ExternalArrow size={10} />
              {entry.externalUrl.startsWith("http") && (
                <span className="visually-hidden"> (opens in a new tab)</span>
              )}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function StoryMeta({
  entry,
  systemName,
  mono = false,
}: {
  entry: NewsroomEntry;
  systemName?: string;
  mono?: boolean;
}) {
  return (
    <p
      className={`text-xs flex flex-wrap items-center gap-x-2 gap-y-1 ${mono ? "font-mono" : ""}`}
      style={{ color: "var(--text-tertiary)" }}
    >
      <span>{getDeskName(entry.desk)}</span>
      {entry.seriesLabel && (
        <>
          <span aria-hidden="true">·</span>
          <span>{entry.seriesLabel}</span>
        </>
      )}
      <span aria-hidden="true">·</span>
      <time dateTime={entry.publishedAt ?? undefined}>
        {formatDateOrUndated(entry.publishedAt)}
      </time>
      {systemName && (
        <>
          <span aria-hidden="true">·</span>
          <Link
            href={`/systems/${entry.systemSlug}`}
            className="transition-opacity duration-150 hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            {systemName}
          </Link>
        </>
      )}
    </p>
  );
}
