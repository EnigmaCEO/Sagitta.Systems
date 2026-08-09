"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * The video frame — one implementation, used everywhere a video plays.
 *
 * Extracted from WatchDeck rather than written a second time for the system
 * pages. The homepage stage and the Radar overview now render the same frame,
 * which is the only way the guarantees below can be guarantees: a second
 * implementation is a second place for `allowFullScreen` to go missing or for a
 * third-party request to start firing on load.
 *
 * What the frame is, in order of what it protects:
 *
 *   1. Nothing is requested from YouTube until the reader asks. The static HTML
 *      contains a poster served from this origin and an anchor — no iframe, no
 *      script, no preconnect. The embed is created by the first click. This is
 *      stronger than `loading="lazy"`, which still puts a third-party frame in
 *      the document and loads it on approach, and it is asserted across every
 *      exported page in tests/export/rendered.test.mjs.
 *   2. It holds 16:9 at every width, before and after playback starts, so the
 *      page never jumps when the frame resolves.
 *   3. Progressive enhancement. The poster is a real anchor to the video's own
 *      page. Without scripting it navigates there; with scripting the click is
 *      intercepted and the video plays here. There is no dead control either
 *      way, and a modified click (new tab, new window) is always left alone.
 *   4. The reader keeps their controls. `autoplay=1` appears only on a frame
 *      that exists because of a click — it is what makes the click play the
 *      video rather than merely reveal a paused one — and nothing is ever
 *      muted, so a video starts with sound, as a reader pressing play expects.
 */
export interface VideoFrameProps {
  /** Poster served from this origin. Never hotlinked from the provider. */
  poster: string;
  alt: string;
  /** The video's canonical title. Becomes the frame's accessible name. */
  title: string;
  /** The video's own page. Where a reader without scripting goes. */
  href: string;
  /** Provider video id. Without one the frame is a link and never plays here. */
  embedId?: string;
  /** Runtime, rendered as a chip only where the source publishes one. */
  duration?: string;
  /** Analytics attributes, passed through to the anchor. */
  cta: { id: string; type: string; availability: string };
  /** Frame classes. The homepage bleeds its frame off the viewport edge. */
  className?: string;
  /** `sizes` for the poster. */
  sizes?: string;
  priority?: boolean;
  /** Lets a parent render copy that depends on whether playback has started. */
  onPlayingChange?: (playing: boolean) => void;
  ref?: React.Ref<HTMLDivElement>;
}

export default function VideoFrame({
  poster,
  alt,
  title,
  href,
  embedId,
  duration,
  cta,
  className = "poster",
  sizes = "(min-width: 1024px) 66vw, 100vw",
  priority,
  onPlayingChange,
  ref,
}: VideoFrameProps) {
  const [playing, setPlaying] = useState(false);

  function play() {
    setPlaying(true);
    onPlayingChange?.(true);
  }

  return (
    <div ref={ref} tabIndex={-1} className={className} style={{ aspectRatio: "16 / 9" }}>
      {playing && embedId ? (
        <iframe
          // The privacy-enhanced host: no cookie is set until playback. This
          // frame only exists as the result of a click, which is what makes the
          // autoplay parameter safe — nothing plays on load.
          src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 0, zIndex: 20 }}
        />
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cta={cta.id}
          data-cta-type={cta.type}
          data-cta-availability={cta.availability}
          className="group absolute inset-0"
          onClick={(event) => {
            // Only take over the click when the video can actually play here,
            // and only for an ordinary left click — a reader opening it in a
            // new tab still gets YouTube.
            if (!embedId) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
            event.preventDefault();
            play();
          }}
        >
          <Image
            src={poster}
            alt={alt}
            fill
            sizes={sizes}
            style={{ objectFit: "cover" }}
            priority={priority}
          />
          <span aria-hidden="true" className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="play-badge play-badge-lg">
              <svg width="26" height="26" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M5 3.4v11.2L14.6 9z" fill="currentColor" />
              </svg>
            </span>
          </span>
          {duration && <span className="runtime-chip">{duration}</span>}
          <span className="visually-hidden">
            {embedId
              ? `Play ${title} on this page`
              : `Watch ${title} on YouTube (opens in a new tab)`}
          </span>
        </a>
      )}
    </div>
  );
}
