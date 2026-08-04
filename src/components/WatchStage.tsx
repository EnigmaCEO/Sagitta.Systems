import Image from "next/image";
import { formatDate, forthcomingProgramme, getSystemName } from "@/content";
import type { ForthcomingProgramme } from "@/content/watch";
import type { PromotionRecord } from "@/content/types";
import PromoAction from "./PromoAction";
import WatchDeck, { type WatchVideo } from "./WatchDeck";

/**
 * Watch — the cinematic interruption between the product moment and the desk.
 *
 * Unlike the other stages, this one always renders. It has two states, and the
 * promotion collection decides which:
 *
 *   published    — one or more verified `video-feature` promotions exist. The
 *                  stage becomes a channel: one video plays at full scale and
 *                  the rest queue beside it, each with a verified 16:9 poster,
 *                  its exact title, its source, its date, and a runtime only
 *                  where the source publishes one.
 *   forthcoming  — no verified episode exists. The stage presents the announced
 *                  programme instead.
 *
 * Since 2026-07-31 the stage is in its published state, carrying the two videos
 * on the Sagitta Labs YouTube channel. Nothing about either is known to this
 * component: it selects the live state because `video-feature` promotions exist,
 * exactly as it was built to. The forthcoming implementation is kept intact so a
 * truthful programme announcement can render again later.
 *
 * This component stays on the server. It resolves each promotion into the
 * serialisable shape the deck needs — joining the system name and formatting the
 * date here — so the content layer never reaches the browser bundle. Playback
 * itself is the deck's job, because it needs state.
 *
 * The forthcoming state is the part that has to be got right. It is a programme
 * announcement, not a simulated player: no play control, no duration, no view
 * count, no episode link, no YouTube. Its picture is approved Sagitta artwork
 * and its one destination is a Sagitta page that already exists.
 */
export default function WatchStage({ promotions }: { promotions: PromotionRecord[] }) {
  // Never an episode without a poster: the stage shows a real frame of a real
  // video or it shows nothing.
  const episodes = promotions.filter((p) => p.media?.src).map(toVideo);

  return (
    <section id="watch" aria-labelledby="watch-heading" className="stage-watch py-24 md:py-36">
      <span aria-hidden="true" className="atmosphere haze-watch" />
      <span aria-hidden="true" className="atmosphere lattice lattice-watch" />
      <span aria-hidden="true" className="atmosphere grain" />

      <div className="canvas relative z-10">
        <h2 id="watch-heading" className="stage-eyebrow mb-10">
          Watch
        </h2>

        {episodes.length > 0 ? (
          <WatchDeck videos={episodes} />
        ) : (
          <Forthcoming programme={forthcomingProgramme} />
        )}
      </div>
    </section>
  );
}

/**
 * The forthcoming state: a programme poster, not a player.
 *
 * The picture is large enough to interrupt the page — this is meant to read as
 * a network-programme announcement rather than a content card — and the status
 * line is the only claim it makes.
 */
function Forthcoming({ programme }: { programme: ForthcomingProgramme }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
      {/* The poster runs off the left edge of the viewport. The lead stage
          breaks right and the product stage breaks right; this one breaks the
          other way, so the page never settles into one direction. */}
      <div className="lg:col-span-7 xl:col-span-8 order-1 lg:-ml-[max(var(--gutter),6vw)]">
        {/* A poster is a framed format, so it keeps its frame — except along
            the edge it runs past. */}
        <div className="poster poster-bleed-left" style={{ aspectRatio: "16 / 9" }}>
          <Image
            src={programme.poster.src}
            alt={programme.poster.alt}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      <div className="lg:col-span-5 xl:col-span-4 order-2">
        <p className="forthcoming-mark mb-5">{programme.status}</p>

        <h3 className="stage-title mb-5">{programme.programme}</h3>

        <p className="measure text-base leading-relaxed mb-7" style={{ color: "var(--text-secondary)" }}>
          {programme.premise}
        </p>

        <ul className="mb-8">
          {programme.standfirst.map((line) => (
            <li
              key={line}
              className="meta-line py-2 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              {line}
            </li>
          ))}
        </ul>

        <PromoAction action={programme.action} />
      </div>
    </div>
  );
}

/**
 * Resolves a promotion into the serialisable shape the deck needs.
 *
 * Every optional field stays optional: a runtime is passed only where the
 * source publishes one, an embed id only where the source permits inline
 * playback, and a date only where one is verified. The deck renders what it is
 * given and invents nothing to fill a gap.
 */
function toVideo(promotion: PromotionRecord): WatchVideo {
  const media = promotion.media!;

  return {
    id: promotion.id,
    eyebrow: promotion.eyebrow,
    title: promotion.headline,
    displayTitle: promotion.displayHeadline,
    system: getSystemName(promotion.systemSlugs[0]),
    publishedAt: promotion.publishedAt ?? undefined,
    publishedLabel: promotion.publishedAt ? formatDate(promotion.publishedAt) : undefined,
    duration: media.duration,
    poster: media.poster ?? media.src,
    alt: media.alt,
    href: promotion.action.href,
    embedId: media.embed?.id,
    action: {
      id: promotion.action.id,
      label: promotion.action.label,
      type: promotion.action.type,
      availability: promotion.action.availability,
      note: promotion.action.note,
    },
  };
}
