import type { VideoRecord } from "./types";

// Published recordings, held once.
//
// Before this file existed, a video was whatever the promotion staging it said
// it was: the title, the runtime, the poster, and the embed id all lived inside
// a `PromotionRecord`, which was fine while a video appeared in exactly one
// place. Sagitta Radar Overview appears in three — the Radar system page, the
// media library, and the homepage Watch stage — and three copies of the same
// metadata is three chances for a runtime to say 1:55 on one surface and
// something else on another.
//
// Only the provider's video id is stored, never an embed URL. The frame that
// plays it builds the privacy-enhanced URL from the id (see VideoFrame), which
// is the same rule `PromotionEmbed` follows and for the same reason: one place
// constructs the third-party URL, so the no-cookie host cannot be bypassed by a
// hand-written URL on one surface.
//
// So the video is the record and the placements resolve it. A promotion at
// `video-feature` carries `videoId` and supplies only its own editorial framing
// (the stage headline, the eyebrow, the action); everything about the video
// itself is read from here. The rule is enforced in scripts/check-content.mjs.
//
// Two things are stated rather than assumed:
//
//   listing   Whether the provider lists the video publicly. Sagitta Radar
//             Overview is unlisted — it plays for anyone with the link and
//             appears in no channel listing, feed, or search result — so
//             nothing on the site may present it as browsable on a channel.
//   channel   The account it is actually published on. The two earlier videos
//             are on Sagitta Labs; this one is on Sagitta Systems. They are not
//             the same account and are not merged into one claim.

export const videos: VideoRecord[] = [
  {
    id: "radar-overview-2026",
    title: "Sagitta Radar Overview",
    standfirst: "DeFi Infrastructure Intelligence",
    description:
      "A product overview of Sagitta Radar and how it monitors DeFi infrastructure, identifies relevant changes, records evidence-backed findings, and delivers intelligence to operator workflows.",
    systemSlug: "sagitta-radar",
    classification: "Product Overview",
    provider: "youtube",
    providerVideoId: "KchWMxZIn_g",
    sourceUrl: "https://www.youtube.com/watch?v=KchWMxZIn_g",
    channelName: "Sagitta Systems",
    listing: "unlisted",
    duration: "1:55",
    publishedAt: "2026-08-08",
    poster: {
      src: "/watch/radar-overview.jpg",
      alt: "Thumbnail published with the Sagitta Radar Overview video on YouTube.",
    },
    verification: {
      status: "verified",
      source:
        "https://www.youtube.com/watch?v=KchWMxZIn_g (title and channel resolved via YouTube oEmbed, 2026-08-08) + owner-supplied runtime and date",
      lastVerifiedAt: "2026-08-08",
      note:
        "Exact title 'Sagitta Radar Overview' and channel 'Sagitta Systems' returned by oEmbed, which resolves unlisted videos. The runtime 1:55 and the date 2026-08-08 are owner-supplied approved source information — YouTube publishes no machine-readable duration or upload date for an unlisted video, so neither was read. The poster is YouTube's own maxres thumbnail for this video id, stored locally so nothing is requested from a third-party host on page load. Listed as unlisted: it is not on the Sagitta Labs channel, it is not in any public feed, and no surface presents it as browsable. No newsroom record accompanies it — it is a reusable product media asset, not a publication event.",
    },
    publicationState: "published",
    visibility: "public",
  },
];

// ─── Queries ─────────────────────────────────────────────────────────────────

export const publicVideos = videos.filter(
  (v) => v.visibility === "public" && v.publicationState === "published",
);

export function getVideo(id: string): VideoRecord | undefined {
  return videos.find((v) => v.id === id);
}

/** Published videos belonging to one system, in publication order, newest first. */
export function videosForSystem(slug: string): VideoRecord[] {
  return publicVideos
    .filter((v) => v.systemSlug === slug)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}
