"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VideoFrame from "./VideoFrame";
import { ExternalArrow } from "./icons";

/**
 * A video, resolved on the server.
 *
 * The stage joins each promotion to its system name and formats its date before
 * handing it over, so nothing but serialisable data crosses into the client and
 * the content layer stays out of the browser bundle — the same contract the
 * lead carousel works to.
 */
export interface WatchVideo {
  id: string;
  eyebrow: string;
  /** The canonical title, exactly as the source published it. */
  title: string;
  /** Approved shorter form, for the compact list beside the player. */
  displayTitle?: string;
  system?: string;
  /** ISO date, for the `datetime` attribute. */
  publishedAt?: string;
  /** Formatted date, for the reader. */
  publishedLabel?: string;
  /** Runtime, present only where the source publishes one. */
  duration?: string;
  poster: string;
  alt: string;
  /** The video's own page. Where a reader without scripting goes. */
  href: string;
  /** YouTube video id, where the source permits inline playback. */
  embedId?: string;
  action: {
    id: string;
    label: string;
    type: string;
    availability: string;
    note?: string;
  };
}

/**
 * Watch — the published state, built for a channel rather than a single clip.
 *
 * Three things it has to do at once:
 *
 *   1. Play in place. A reader who wants to watch a 41-second introduction
 *      should not be sent to another site and lose the page.
 *   2. Hold more than one video without becoming a grid of equal cards. The
 *      composition stays asymmetrical: one video at full scale bleeding off the
 *      left edge, the rest as a queue beside it. Selecting one promotes it.
 *   3. Cost nothing until it is asked for. No YouTube script, iframe, cookie,
 *      or request is made on page load — only the poster, which is served from
 *      this origin. The embed is created on the first play and uses the
 *      privacy-enhanced host.
 *
 * Progressive enhancement, deliberately: the poster is a real anchor to the
 * video's own page in the static HTML. Without scripting it navigates there and
 * the stage still works. With scripting, the click is intercepted and the video
 * plays here instead. There is no dead control in either case.
 */
/** True when one label is the other, or is contained in it — "Radar" in "Sagitta Radar". */
function namesSameThing(eyebrow: string, system: string): boolean {
  const a = eyebrow.trim().toLowerCase();
  const b = system.trim().toLowerCase();
  return a.includes(b) || b.includes(a);
}

export default function WatchDeck({ videos }: { videos: WatchVideo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);

  const active = videos[activeIndex] ?? videos[0];
  const queue = videos.filter((_, i) => i !== activeIndex);

  // Moving focus to the player after a queue selection, so a keyboard reader is
  // taken to the thing they just chose rather than left in the list behind it.
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    frameRef.current?.focus();
  }, [activeIndex]);

  function select(index: number) {
    shouldFocus.current = true;
    setActiveIndex(index);
    // A new selection starts from its poster rather than inheriting the
    // previous video's playing state, so nothing ever starts unasked.
    setPlaying(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* The player. Runs off the left edge of the viewport: the lead stage
          breaks right and the product stage breaks right, so this one breaks
          the other way and the page never settles into one direction. */}
      <div className="lg:col-span-7 xl:col-span-8 order-1 lg:-ml-[max(var(--gutter),6vw)]">
        {/* The frame itself is shared with the system pages — see VideoFrame.
            Keyed by the active video so promoting one from the queue mounts a
            fresh frame: a new selection starts from its poster rather than
            inheriting the previous video's playing state, and nothing ever
            starts unasked. */}
        <VideoFrame
          key={active.id}
          ref={frameRef}
          className="poster poster-bleed-left"
          poster={active.poster}
          alt={active.alt}
          title={active.title}
          href={active.href}
          embedId={active.embedId}
          duration={active.duration}
          cta={active.action}
          onPlayingChange={setPlaying}
          priority
        />

        {/* Stated rather than assumed: nothing is requested from YouTube until
            the reader asks for it.

            The padding cancels the frame's negative margin. The player runs off
            the left edge of the viewport on purpose; this line is type and must
            not, so it starts back at the gutter where every other line on the
            page does. */}
        {active.embedId && (
          <p className="meta-line mt-4 lg:pl-[max(var(--gutter),6vw)]">
            {playing
              ? "Playing from YouTube on this page."
              : "Plays here. Nothing loads from YouTube until you press play."}
          </p>
        )}
      </div>

      <div className="lg:col-span-5 xl:col-span-4 order-2">
        {/* The system is appended only where the eyebrow does not already name
            it. A channel eyebrow ("YouTube · Sagitta Labs") and a system are
            two different facts and both belong on the line; a product eyebrow
            ("Radar") beside "Sagitta Radar" is the same fact twice. */}
        <p className="meta-line mb-4">
          {active.eyebrow}
          {active.system && !namesSameThing(active.eyebrow, active.system)
            ? ` · ${active.system}`
            : ""}
          {active.publishedLabel && (
            <>
              <span aria-hidden="true"> · </span>
              <time dateTime={active.publishedAt}>{active.publishedLabel}</time>
            </>
          )}
        </p>

        {/* The exact published title, always — a video's title is the one piece
            of metadata this stage must not paraphrase. Real titles vary from 17
            characters to 69, so the type steps down for a long one instead of
            being truncated: "Sagitta Protocol Overview | Trustless Wealth
            Management Infrastructure" set to six lines at the display size.
            aria-live so promoting a video from the queue is announced rather
            than silently swapping the heading under a reader. */}
        <h3
          className="watch-title mb-5"
          data-long={active.title.length > 44 ? "true" : undefined}
          aria-live="polite"
        >
          {active.title}
        </h3>

        {/* `action-line` is the flex container, so the label and its arrow
            cannot be split across two lines by a narrow column. */}
        <a
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cta={`${active.action.id}:source`}
          data-cta-type={active.action.type}
          data-cta-availability={active.action.availability}
          className="action-line mb-8"
        >
          {active.action.label}
          <ExternalArrow size={12} />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>

        {active.action.note && (
          <p className="text-xs leading-relaxed mb-8" style={{ color: "var(--text-tertiary)" }}>
            {active.action.note}
          </p>
        )}

        {queue.length > 0 && (
          <div>
            {/* "More videos", not "Also on the channel": Sagitta publishes on
                two YouTube accounts and one of these videos is unlisted, so a
                queue heading that implies a single browsable channel would be
                stating something none of these records support. */}
            <p className="stage-eyebrow mb-4">More videos</p>
            <ul>
              {queue.map((video) => {
                const index = videos.indexOf(video);
                return (
                  <li key={video.id}>
                    {/* An anchor, not a button, for the same reason the poster
                        is: without scripting it has to go somewhere real. JS
                        intercepts the click and promotes the video into the
                        player instead. */}
                    <a
                      href={video.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta={`${video.action.id}:queue`}
                      data-cta-type={video.action.type}
                      data-cta-availability={video.action.availability}
                      onClick={(event) => {
                        if (!video.embedId) return;
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
                          return;
                        }
                        event.preventDefault();
                        select(index);
                      }}
                      className="watch-queue-item"
                    >
                      <span className="watch-queue-thumb">
                        <Image
                          src={video.poster}
                          alt=""
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                        />
                      </span>
                      <span className="watch-queue-text">
                        <span className="watch-queue-title">
                          {video.displayTitle ?? video.title}
                          {video.displayTitle && (
                            <span className="visually-hidden">
                              . Published as: {video.title}
                            </span>
                          )}
                        </span>
                        <span className="meta-line">
                          {video.publishedLabel}
                          {video.duration ? ` · ${video.duration}` : ""}
                        </span>
                      </span>
                      <span className="visually-hidden">
                        {video.embedId
                          ? " — play on this page"
                          : " (opens in a new tab)"}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
