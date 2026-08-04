import CinematicFeature from "@/components/CinematicFeature";
import LeadCarousel, { type LeadSlide } from "@/components/LeadCarousel";
import NetworkHeadlines from "@/components/NetworkHeadlines";
import ProductMoment from "@/components/ProductMoment";
import SignalStrip from "@/components/SignalStrip";
import WatchStage from "@/components/WatchStage";
import JsonLd from "@/components/JsonLd";
import Link from "@/components/Link";
import {
  ecosystemThesis,
  formatDate,
  getNewsroomEntry,
  getSystemName,
  promotionsAt,
  solePromotionAt,
} from "@/content";
import type { PromotionRecord } from "@/content/types";
import { buildMetadata } from "@/lib/metadata";
import { videoObjectLd } from "@/lib/jsonld";

export const metadata = buildMetadata({
  // The tagline alone. `buildMetadata` appends the site name itself, and
  // passing it here as well is what produced the doubled homepage title.
  title: "DeFi Continuity, Allocation & Protocol Infrastructure | Sagitta Systems",
  description:
    "What Sagitta is seeing and doing now: live infrastructure signals, launches, allocation intelligence, and protocol readiness — with the route into the system that supports the next decision.",
  path: "/",
  ogImage: "/og/home.png",
});

/**
 * The promotional front page.
 *
 * Its job is not to explain the network — /systems does that, /newsroom holds
 * the record, /about holds the institution. This page promotes the latest reason
 * to enter each system and hands the reader to it.
 *
 * The rhythm is fixed, and each stage is a different medium with its own spatial
 * logic rather than another band of the same section:
 *
 *   lead carousel     cinematic, near-full-viewport, media past the gutter
 *   ecosystem line    one sentence, no chrome, the page's only statement of what
 *                     the network is for
 *   signal strip      typographic, immediate, the fastest line on the page
 *   product moment    operational, interface-led, asymmetrical
 *   Watch             cinematic, human, playable
 *   from the network  editorial, text-led, publication-like
 *   closing feature   immersive, atmospheric, consequential
 *
 * Every stage but Watch reads one placement of the promotion collection and
 * renders nothing when that placement is empty, so the page contracts around
 * what is actually true today instead of staging a placeholder to hold the
 * shape. Watch is the exception on purpose: it is part of the composition, and
 * it has a truthful state for having published nothing yet.
 */
export default function HomePage() {
  const lead = promotionsAt("lead-carousel", 5);
  const signals = promotionsAt("signal-strip", 5);
  const product = solePromotionAt("product-feature");
  const videos = promotionsAt("video-feature", 4);
  const videoSchema = videos
    .map((promotion) => promotion.canonicalRecord?.replace("/newsroom/", ""))
    .map((slug) => (slug ? getNewsroomEntry(slug) : undefined))
    .map((entry) => (entry ? videoObjectLd(entry) : null))
    .filter((entry) => entry !== null);
  const headlines = promotionsAt("network-headlines", 4);
  const feature = solePromotionAt("cinematic-feature");

  return (
    <div className="broadcast">
      {videoSchema.map((entry) => (
        <JsonLd key={entry.url} data={entry} />
      ))}
      {lead.length > 0 && <LeadCarousel slides={lead.map(toSlide)} />}

      {/* One sentence, and the only sentence on this page that describes the
          network rather than promoting something in it. It sits here because a
          reader who leaves after the opening should still have seen what the
          systems below are for; it stays one line, with a link rather than an
          argument, because the explanation belongs to /systems. */}
      <section aria-label="What Sagitta Systems is" className="canvas pt-12 pb-2">
        <p
          className="text-base sm:text-lg leading-relaxed max-w-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          {ecosystemThesis.short}{" "}
          <Link
            href="/systems#ecosystem"
            className="font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-80"
            style={{ color: "var(--gold)" }}
          >
            How each system contributes →
          </Link>
        </p>
      </section>

      <SignalStrip promotions={signals} />

      {product && <ProductMoment promotion={product} />}

      {/* Always present. Shows a real episode once one exists, and Sagitta
          Defense Review as forthcoming programming until then. */}
      <WatchStage promotions={videos} />

      <NetworkHeadlines
        promotions={headlines}
        action={{ label: "The full record", href: "/newsroom" }}
      />

      {feature && <CinematicFeature promotion={feature} />}
    </div>
  );
}

/**
 * Resolves a promotion into the serialisable shape the carousel needs. The join
 * to the system record and the date formatting happen here so the client bundle
 * never carries the content layer.
 */
function toSlide(promotion: PromotionRecord): LeadSlide {
  const system = getSystemName(promotion.systemSlugs[0]);

  return {
    id: promotion.id,
    eyebrow: promotion.eyebrow,
    headline: promotion.headline,
    context: promotion.context,
    action: promotion.action,
    media: promotion.media,
    meta: [
      promotion.sourceName,
      promotion.publishedAt ? formatDate(promotion.publishedAt) : null,
      system ?? null,
    ].filter((value): value is string => Boolean(value)),
    // The rail names each story by its subject rather than repeating the
    // headline, so three markers can sit side by side without competing with
    // the story that is actually open.
    marker: promotion.eyebrow,
  };
}
