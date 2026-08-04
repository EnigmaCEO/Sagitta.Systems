import Image from "next/image";
import type { NewsroomMedia } from "@/content/types";

/**
 * Audio and video presentation for newsroom records.
 *
 * These render *only* from a record's verified `media` block. Sagitta has no
 * published recording yet, so today they render nothing anywhere — which is the
 * point: the capability ships without a fabricated episode to demonstrate it.
 * The content validator checks that any populated block points at a real file
 * or an approved embed.
 *
 * Neither element autoplays, both expose native controls, and both carry
 * `preload="none"` so a media record costs nothing until a reader asks for it.
 */
export default function MediaPlayer({
  media,
  title,
}: {
  media: NewsroomMedia | undefined;
  title: string;
}) {
  if (!media) return null;

  return (
    <figure
      className="rounded-xl border overflow-hidden m-0"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      {media.delivery === "embed" ? (
        <div style={{ aspectRatio: media.kind === "video" ? "16 / 9" : undefined }}>
          <iframe
            src={media.src}
            title={title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full border-0"
            style={{ height: media.kind === "video" ? "100%" : 160, display: "block" }}
          />
        </div>
      ) : media.kind === "video" ? (
        <video
          controls
          preload="none"
          poster={media.poster}
          className="w-full block"
          style={{ aspectRatio: "16 / 9", backgroundColor: "var(--bg-base)" }}
        >
          <source src={media.src} />
          Your browser does not support embedded video. Use the download link below.
        </video>
      ) : (
        <div className="p-5">
          {media.poster && (
            <Image
              src={media.poster}
              alt=""
              width={640}
              height={160}
              className="w-full rounded-lg mb-4 object-cover"
              style={{ maxHeight: 120 }}
            />
          )}
          <audio controls preload="none" className="w-full">
            <source src={media.src} />
            Your browser does not support embedded audio. Use the download link below.
          </audio>
        </div>
      )}

      <figcaption
        className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 border-t text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}
      >
        <span>{media.kind === "video" ? "Video" : "Audio"}</span>
        {media.duration && <span>{media.duration}</span>}
        {media.transcriptUrl && (
          <a
            href={media.transcriptUrl}
            className="font-semibold"
            style={{ color: "var(--family-accent)" }}
          >
            Read the transcript
          </a>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Compact duration/format strip for cards, where the player itself would be too
 * heavy. Renders nothing without verified media.
 */
export function MediaMeta({ media }: { media: NewsroomMedia | undefined }) {
  if (!media) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: "var(--family-accent)" }}
      />
      {media.kind === "video" ? "Watch" : "Listen"}
      {media.duration ? ` · ${media.duration}` : ""}
    </span>
  );
}
