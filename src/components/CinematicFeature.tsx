import Image from "next/image";
import type { PromotionRecord } from "@/content/types";
import PromoAction from "./PromoAction";

/**
 * The closing feature: one image, one headline, one sentence, one action.
 *
 * This is the last thing a reader sees before the footer, so it promotes the
 * most consequential verified thing the network currently has — and states the
 * qualification that comes with it rather than leaving the scale of the claim
 * to the picture.
 *
 * Where the opening stage is lit from the upper right and sits close to the
 * reader, this one is lit from below and behind: the picture emerges out of the
 * dark with constellation geometry drawn over it, drifting slowly, and the type
 * sits low in the frame. It is the same palette in a different room, which is
 * what stops the page from ending the way it began — and the feature promotes a
 * different system from the active lead story by editorial rule.
 */
/**
 * Media kinds that carry information rather than atmosphere.
 *
 * A constellation graphic or a system mark can be cropped to the viewport and
 * lose nothing — it is a field for the type to sit in. A diagram or a document
 * page cannot: crop a landscape architecture diagram into a 16:9 stage and the
 * bottom of it, which is usually where the conclusion is, is simply gone. So
 * the stage has two compositions and the media decides which, the same way the
 * Watch stage has two states and the collection decides which.
 */
const EVIDENCE_MEDIA = new Set(["diagram", "report-cover", "article-cover", "product-screenshot"]);

export default function CinematicFeature({ promotion }: { promotion: PromotionRecord }) {
  const media = promotion.media;
  const isEvidence = Boolean(media && EVIDENCE_MEDIA.has(media.kind));

  return (
    <section
      id="feature"
      aria-labelledby="feature-heading"
      className={
        isEvidence
          ? "stage-close flex items-center min-h-[76svh] py-24 md:py-32"
          : "stage-close flex items-end min-h-[76svh] py-24 md:py-32"
      }
    >
      {/* The immersive composition: the picture is the room the type stands in,
          filling the viewport and dissolving into it. */}
      {media && !isEvidence && (
        <Image
          className="close-image"
          src={media.src}
          alt={media.alt}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      )}

      <span aria-hidden="true" className="atmosphere haze-close" />
      {/* The widest cell on the page, with a few of them lit — the closing
          stage is where the structure is meant to be legible as structure. */}
      <span aria-hidden="true" className="atmosphere lattice lattice-close" />
      <span aria-hidden="true" className="atmosphere lattice-lit" />
      <ConstellationGeometry />
      <span aria-hidden="true" className="atmosphere grain" />

      <div className="canvas relative z-10">
        {isEvidence && media ? (
          // The evidence composition: the artifact is shown whole, on a plate
          // that breaks the right gutter, with the type asymmetrical beside it.
          // Same room, same light, different arrangement — the page still ends
          // somewhere it has not already been.
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <FeatureType promotion={promotion} />
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 lg:-mr-[max(var(--gutter),6vw)]">
              <div className="artifact-plate">
                <Image
                  src={media.src}
                  alt={media.alt}
                  width={1440}
                  height={1200}
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <FeatureType promotion={promotion} />
        )}
      </div>
    </section>
  );
}

/** Eyebrow, headline, one sentence, one action. Identical in both compositions. */
function FeatureType({ promotion }: { promotion: PromotionRecord }) {
  return (
    <>
      <p className="stage-eyebrow mb-6">{promotion.eyebrow}</p>

      <h2 id="feature-heading" className="stage-title mb-6 max-w-4xl">
        {promotion.headline}
      </h2>

      {promotion.context && (
        <p
          className="measure text-base md:text-lg leading-relaxed mb-9"
          style={{ color: "var(--text-secondary)" }}
        >
          {promotion.context}
        </p>
      )}

      <PromoAction action={promotion.action} showNote />
    </>
  );
}

/**
 * Sagitta's own figure, drawn over the closing image.
 *
 * The five stars and the two lines between them are the constellation the
 * network is named for. It is decoration and is marked as such — every fact on
 * this stage is in the text beside it.
 */
function ConstellationGeometry() {
  return (
    <svg
      aria-hidden="true"
      className="atmosphere constellation-lines motion-drift"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMaxYMid slice"
      style={{ opacity: 0.55 }}
    >
      <line x1="742" y1="146" x2="884" y2="238" />
      <line x1="884" y1="238" x2="1016" y2="316" />
      <line x1="1016" y1="316" x2="1128" y2="292" />
      <line x1="1016" y1="316" x2="1074" y2="416" />
      {[
        [742, 146, 2.6],
        [884, 238, 2],
        [1016, 316, 3.4],
        [1128, 292, 2.2],
        [1074, 416, 2.4],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
      ))}
    </svg>
  );
}
