"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { ContentAction, PromotionMedia } from "@/content/types";
import PromoAction from "./PromoAction";

/**
 * A slide, resolved on the server.
 *
 * The page joins each promotion to its system name and formats its date before
 * handing it over, so nothing but serialisable data crosses into the client and
 * the content layer stays out of the browser bundle.
 */
export interface LeadSlide {
  id: string;
  eyebrow: string;
  headline: string;
  context?: string;
  action: ContentAction;
  media?: PromotionMedia;
  /** Source, date, and system, already assembled. */
  meta: string[];
  /** Short label for the slide's marker in the navigation rail. */
  marker: string;
}

/**
 * The lead stage: the opening composition of the broadcast.
 *
 * It takes most of the first screen. The featured picture runs off the right
 * edge of the viewport rather than sitting in a card beside the text, and the
 * headline is layered into that composition — a dark field is applied only
 * across the part of the picture the type actually crosses. The source, date,
 * and system are compact metadata under the headline, not a logo tile.
 *
 * Constraints that shaped the build, and that still hold:
 *
 *   - Every slide is in the static HTML. Only the active one is shown, so with
 *     scripting unavailable the lead story still renders in full — the controls
 *     are the only thing that stops working, and the remaining slides stay
 *     reachable to assistive technology through the source order.
 *   - One headline, one line of context, one action per slide.
 *   - Slide state is announced: the tablist reports position, and each panel
 *     carries its own position in text rather than in a dot pattern alone.
 *   - It auto-advances, but never over a reader. Rotation is suspended while
 *     the pointer is over the stage, while focus is anywhere inside it, while
 *     the tab is in the background, and permanently once the reader takes
 *     manual control or presses pause. This reverses an earlier decision that
 *     nothing should auto-advance; the obligations that decision was avoiding
 *     are handled explicitly below rather than by not having the feature.
 *   - The marker fill is now a countdown, because with rotation running it is
 *     reporting something real. Before, it was a reveal, because there was
 *     nothing to report.
 */

/** How long a slide holds before the next one. Long enough to read a headline
 *  and its line of context without hurrying. */
const ROTATE_MS = 7000;
/**
 * Rail track by slide count. Written out rather than interpolated because
 * Tailwind resolves class names statically, and three to five is the whole
 * range the collection permits.
 */
const RAIL_COLUMNS: Record<number, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
};

/**
 * The proportion a slide's picture is staged at.
 *
 * Real media does not arrive in one shape: system marks are square, article
 * covers are 2:1, and video posters are 16:9. Cropping a 2:1 cover into the
 * 5:4 frame that suits a composition removes a third of the artwork, so the
 * frame follows what the picture actually is.
 */
function isWideEditorial(media: PromotionMedia): boolean {
  return (
    media.fit === "cover" &&
    (media.kind === "article-cover" ||
      media.kind === "video-thumbnail" ||
      media.kind === "social-preview")
  );
}

function stagedRatio(media: PromotionMedia): string {
  if (media.fit !== "cover") return "1 / 1";
  // Wide editorial artwork is composed to be seen end to end.
  return isWideEditorial(media) ? "16 / 9" : "5 / 4";
}

/**
 * The proportion the picture is staged at on a small screen.
 *
 * The stylesheet's single 4:3 mobile crop was right while every slide carried
 * a square mark. A 2:1 article cover put through it loses a third of its width
 * and cuts the artwork's own typography in half, so wide editorial artwork
 * keeps a wide frame on mobile as well.
 */
function stagedRatioMobile(media: PromotionMedia): string {
  return isWideEditorial(media) ? "16 / 9" : "4 / 3";
}

/**
 * Where the crop is taken from. A composition is anchored to its top, because
 * that is where a hero image puts its subject; wide editorial artwork is
 * centred, because it is cropped horizontally rather than vertically.
 */
function stagedPosition(media: PromotionMedia): string {
  if (media.fit !== "cover") return "center";
  return media.kind === "article-cover" || media.kind === "video-thumbnail"
    ? "center"
    : "top center";
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}
/** Never fires. Turns the store into a "has this hydrated yet" flag. */
function subscribeNever() {
  return () => {};
}

export default function LeadCarousel({ slides }: { slides: LeadSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  /**
   * Rotation state.
   *
   * `playing` is the reader's own switch and is sticky: once it is off — by
   * pressing pause, or by choosing a slide from the rail — it stays off for
   * the session. Nothing silently resumes moving under someone who has taken
   * control of it.
   *
   * `suspended` is temporary and automatic: pointer over the stage, focus
   * inside it, or the tab in the background. It pauses without touching the
   * reader's switch, so leaving the stage resumes exactly as it was.
   */
  /**
   * `null` means the reader has not expressed a preference, so the motion
   * setting decides. Pressing the control sets it explicitly and from then on
   * the reader's choice wins — including choosing to run it under reduced
   * motion, which is theirs to make.
   */
  const [override, setOverride] = useState<boolean | null>(null);
  const [suspended, setSuspended] = useState(false);

  // Both of these are browser state the server cannot know, so they are read
  // through `useSyncExternalStore` rather than assigned from an effect. That
  // is what the hook is for: it gives the server its own snapshot, subscribes
  // on the client, and avoids the extra render pass that setting state inside
  // an effect would cost on every mount.
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);

  // A background tab should not burn through the stories while nobody is
  // looking, and should not have advanced four slides on return.
  useEffect(() => {
    const onVisibility = () => setSuspended(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Reduced motion sets the default, it does not remove the option. Nothing
  // moves unsolicited — that is the whole of what the preference asks for —
  // but a reader who wants the stories to advance can still say so.
  const playing = override ?? !reduced;
  const rotating = playing && !suspended && count > 1;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [rotating, count]);

  /** Choosing a slide is taking control, so rotation stops for good. */
  const select = useCallback((position: number) => {
    setIndex(position);
    setOverride(false);
  }, []);

  return (
    <section
      className="stage-lead"
      aria-roledescription="carousel"
      aria-label="Current across the Sagitta network"
      // Hovering to read, or tabbing into the stage, suspends rotation. Both
      // are the same signal: someone is engaging with what is on screen.
      onMouseEnter={() => setSuspended(true)}
      onMouseLeave={() => setSuspended(false)}
      onFocusCapture={() => setSuspended(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setSuspended(false);
        }
      }}
    >
      {/* Deep-space light and the hexagonal lattice, under everything.

          The concentric radar rings that used to sit here are gone. Once the
          lattice arrived they were a second geometry competing with it in the
          same corner of the same stage, and two overlapping coordinate systems
          read as noise rather than as either one. The sweep stays: it is a
          single geometry. The rotating radar sweep went with them: it was a
          trace over a field that no longer existed, and once the stage's own
          light was quietened it stopped reading as a sweep and started reading
          as a grey wedge in the lower right. What remains is the light, the
          lattice, and the grain. */}
      <span aria-hidden="true" className="atmosphere haze-lead" />
      <span aria-hidden="true" className="atmosphere lattice lattice-lead" />
      <span aria-hidden="true" className="atmosphere grain" />

      <h1 className="visually-hidden">
        Sagitta Systems — what the network is seeing and doing now
      </h1>

      {/* While rotation is running the change is not the reader's doing, so it
          is not announced — an unsolicited slide read out every seven seconds
          is the reason auto-carousels have the reputation they do. Once the
          reader takes control, changes become theirs and are announced. */}
      <div className="canvas relative z-10" aria-live={rotating ? "off" : "polite"}>
        {slides.map((slide, position) => {
          const media = slide.media;
          const active = position === index;

          return (
            <div
              key={slide.id}
              id={`lead-slide-${slide.id}`}
              role="tabpanel"
              aria-label={`${position + 1} of ${count}: ${slide.headline}`}
              hidden={!active}
              className="lead-slide grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-8 lg:gap-0"
            >
              {/* The picture. On large screens it sits under the headline and
                  runs past the gutter; on small screens it leads above it. */}
              {media && (
                <div
                  // Two arrangements, decided by what the picture is.
                  //
                  // A composition is *layered*: it starts at column 6 and runs
                  // under the type column, which is what makes the opening read
                  // as one picture rather than a text block beside a photo. It
                  // can only do that because a composition carries a scrim
                  // where the type crosses it.
                  //
                  // A mark carries no scrim — scrimming a transparent mark
                  // paints the framed logo tile this design removed — so it
                  // cannot be crossed. It starts at column 8 instead, where the
                  // type column ends, and the two sit adjacent. Real headlines
                  // are what forced this: "The infrastructure you depend on is
                  // being watched." fills all four lines to the column edge and
                  // ran straight across the Radar mark.
                  className={
                    media.fit === "cover"
                      ? "lg:col-span-7 lg:col-start-6 lg:row-start-1 order-1 lg:order-2"
                      : "lg:col-span-5 lg:col-start-8 lg:row-start-1 order-1 lg:order-2"
                  }
                >
                  <div
                    className="lead-media"
                    // A mark and a composition are staged differently: the mark
                    // floats in light, the composition is scrimmed and has its
                    // edges dissolved. Stated, so neither gets the other's
                    // treatment by accident.
                    data-fit={media.fit ?? "contain"}
                    style={{
                      // A composition gets a wider crop than a mark, which
                      // needs room around it, and wide editorial artwork gets
                      // wider still. Desktop only — the stylesheet holds mobile
                      // to one landscape proportion.
                      ["--lead-ratio" as string]: stagedRatio(media),
                      ["--lead-ratio-mobile" as string]: stagedRatioMobile(media),
                    }}
                  >
                    <Image
                      src={media.src}
                      alt={media.alt}
                      fill
                      sizes={
                        media.fit === "cover"
                          ? "(min-width: 1024px) 62vw, 100vw"
                          : "(min-width: 1024px) 46vw, 100vw"
                      }
                      priority={position === 0}
                      style={{
                        objectFit: media.fit ?? "contain",
                        objectPosition: stagedPosition(media),
                        padding: media.fit === "cover" ? 0 : "9%",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* The type, layered over the picture from `lg` up. */}
              <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 order-2 lg:order-1 relative z-10">
                <p className="stage-eyebrow mb-6">{slide.eyebrow}</p>

                <h2 className="lede-display mb-6">{slide.headline}</h2>

                {slide.context && (
                  <p className="measure text-base md:text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
                    {slide.context}
                  </p>
                )}

                <PromoAction action={slide.action} />

                <p className="meta-line mt-6">{slide.meta.join("  ·  ")}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* The rail. Numbered, integrated, and quiet enough that the active story
          stays singular while the rest remain discoverable. */}
      {count > 1 && (
        <div className="canvas relative z-10 mt-8 lg:mt-12">
          <div
            role="tablist"
            aria-label="Lead stories"
            // The rail was built against three slides and hard-coded to three
            // columns. Five real stories put two orphans on a second row, so
            // the track now follows the count: three abreast up to three, four
            // and five split so no row is left holding a single marker.
            className={`grid grid-cols-1 gap-x-8 gap-y-2 ${RAIL_COLUMNS[count] ?? "sm:grid-cols-3"} ${
              count > 3 ? "max-w-6xl" : "max-w-4xl"
            }`}
          >
            {slides.map((slide, position) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={position === index}
                aria-controls={`lead-slide-${slide.id}`}
                className="lead-marker tap-target"
                data-running={position === index && rotating && !reduced ? "true" : undefined}
                style={
                  position === index && rotating
                    ? ({ "--rotate-ms": `${ROTATE_MS}ms` } as React.CSSProperties)
                    : undefined
                }
                onClick={() => select(position)}
              >
                <span className="lead-marker-index" aria-hidden="true">
                  {String(position + 1).padStart(2, "0")}
                </span>
                <span className="lead-marker-label">{slide.marker}</span>
                <span className="visually-hidden">
                  {slide.headline} — story {position + 1} of {count}
                </span>
              </button>
            ))}
          </div>

          {/* WCAG 2.2.2: anything that moves automatically for more than five
              seconds needs a mechanism to stop it, and hover alone does not
              count — it is unavailable to a keyboard or touch reader.

              Rendered after hydration, because a control in the static HTML
              would do nothing for a reader without scripting.

              It renders under reduced motion too, where it reads "Play". The
              preference decides the default — nothing moves unless asked — but
              taking the control away would mean a reader who turned system
              animations off for other reasons could never start it here. The
              preference is about unsolicited motion, not about forbidding the
              reader to ask. */}
          {hydrated && (
            <button
              type="button"
              className="lead-rotate-toggle"
              aria-pressed={!playing}
              onClick={() => setOverride(!playing)}
            >
              <span aria-hidden="true" className="lead-rotate-glyph">
                {playing ? (
                  <svg width="9" height="10" viewBox="0 0 9 10">
                    <path d="M0 0h3v10H0zM6 0h3v10H6z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="9" height="10" viewBox="0 0 9 10">
                    <path d="M0 0l9 5-9 5z" fill="currentColor" />
                  </svg>
                )}
              </span>
              {playing ? "Pause" : "Play"}
              <span className="visually-hidden"> the rotating lead stories</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
