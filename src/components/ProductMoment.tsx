import Link from "@/components/Link";
import { getSystemName, selunInterface } from "@/content";
import type { ProductInterface } from "@/content/watch";
import type { PromotionRecord } from "@/content/types";
import PromoAction from "./PromoAction";
import { ArrowRight } from "./icons";

/**
 * The product moment: Selun as a working decision surface.
 *
 * The symbolic version of this stage put the Selun mark on a plinth inside a
 * bordered tile, which told a reader nothing about what Selun does. This one
 * renders the allocation wizard itself — its prompt, its two controls and their
 * option sets, its four portfolio segments, and the seven processing steps it
 * runs — from the same constants the production interface renders from. It is
 * the interface's real structure, not a drawing of one and not an invented
 * screenshot, and the caption says exactly that.
 *
 * What is deliberately absent is any output. A run produces an allocation for
 * the reader who made it; Sagitta publishes none here, so the composition shows
 * the surface mid-run and stops.
 *
 * The composition is asymmetrical by design: the interface takes two thirds of
 * the field and runs off the right edge of the viewport, and the promotional
 * copy sits in a narrow editorial column beside it, written about the decision
 * a reader can make rather than about what the product is.
 */
export default function ProductMoment({ promotion }: { promotion: PromotionRecord }) {
  const system = promotion.systemSlugs[0];
  const systemName = getSystemName(system);

  return (
    <section id="product" aria-labelledby="product-heading" className="relative isolate py-24 md:py-36">
      <span aria-hidden="true" className="atmosphere haze-product" />
      {/* A tighter cell and a diagonal fade: this stage is operational, so its
          lattice reads as a working surface rather than deep space. */}
      <span aria-hidden="true" className="atmosphere lattice lattice-product" />
      <span aria-hidden="true" className="atmosphere grain" />

      <div className="canvas relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* The editorial column. Smaller than the interface, and about the
              decision rather than the product. */}
          <div className="lg:col-span-4">
            <p className="stage-eyebrow mb-6" style={{ color: "var(--violet)" }}>
              {promotion.eyebrow}
            </p>

            <h2 id="product-heading" className="stage-title mb-6">
              {promotion.headline}
            </h2>

            {promotion.context && (
              <p className="measure text-base leading-relaxed mb-9" style={{ color: "var(--text-secondary)" }}>
                {promotion.context}
              </p>
            )}

            <PromoAction action={promotion.action} showNote />

            {system && (
              <p className="mt-8">
                <Link
                  href={`/systems/${system}`}
                  className="inline-flex items-center gap-1.5 meta-line font-semibold hover:opacity-80 transition-opacity duration-150"
                >
                  {systemName ? `${systemName} system record` : "System record"}
                  <ArrowRight size={12} />
                </Link>
              </p>
            )}
          </div>

          {/* The interface. Runs past the gutter on large screens, so the page
              reads as a window onto something bigger than the column. */}
          <div className="lg:col-span-8 lg:-mr-[max(var(--gutter),6vw)]">
            <SelunSurface surface={selunInterface} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The allocation wizard, rendered from the content layer's record of it.
 *
 * Every label, option, segment, and step below comes from `selunInterface`,
 * which is read from the production wizard's own constants. Nothing here is
 * interactive: this is a picture of a running surface, so it carries no
 * controls a reader could press and no state they could change.
 *
 * It stays real text rather than an image, and stays in the accessibility tree
 * rather than being hidden behind its caption — what the interface asks and
 * what it does is information, and this page does not put information anywhere
 * a reader can only see it.
 */
function SelunSurface({ surface }: { surface: ProductInterface }) {
  const activeIndex = surface.stages.findIndex((stage) => stage.key === surface.activeStage);

  return (
    <figure className="m-0">
      <div className="interface-frame interface-bleed-right">
        {/* Chrome. The host is real and is stated, not implied. */}
        <div className="interface-bar flex items-center gap-3 px-4 py-3">
          <span className="flex items-center gap-1.5">
            <span className="interface-dot" />
            <span className="interface-dot" />
            <span className="interface-dot" />
          </span>
          <span className="text-xs font-mono truncate" style={{ color: "var(--text-tertiary)" }}>
            {surface.surface}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* The reader's inputs. */}
          <div className="md:col-span-3 p-5 md:p-7">
            <p className="text-sm leading-snug mb-6" style={{ color: "var(--text-secondary)" }}>
              {surface.prompt}
            </p>

            {surface.controls.map((control) => (
              <div key={control.label} className="mb-6">
                <p
                  className="text-[0.6875rem] uppercase font-bold mb-2.5"
                  style={{ letterSpacing: "0.16em", color: "var(--text-tertiary)" }}
                >
                  {control.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {control.options.map((option) => (
                    <span
                      key={option}
                      className="interface-chip"
                      data-selected={option === control.initial}
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <p
              className="text-[0.6875rem] uppercase font-bold mb-2.5"
              style={{ letterSpacing: "0.16em", color: "var(--text-tertiary)" }}
            >
              Portfolio Segment
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {surface.segments.map((segment, position) => (
                <div
                  key={segment.title}
                  className="interface-segment p-3"
                  data-selected={position === 0}
                >
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {segment.title}
                  </p>
                  <p
                    className="text-[0.6875rem] leading-snug mb-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {segment.volatility}
                  </p>
                  <p className="text-[0.6875rem] font-mono" style={{ color: "var(--text-tertiary)" }}>
                    {segment.examples.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What the agent does with them. */}
          <div
            className="md:col-span-2 p-5 md:p-7 border-t md:border-t-0 md:border-l"
            style={{ borderColor: "var(--border)", backgroundColor: "rgba(4, 7, 13, 0.5)" }}
          >
            <p
              className="text-[0.6875rem] uppercase font-bold mb-4"
              style={{ letterSpacing: "0.16em", color: "var(--text-tertiary)" }}
            >
              Allocation run
            </p>

            <ol className="mb-6">
              {surface.stages.map((stage, position) => (
                <li
                  key={stage.key}
                  className="interface-step"
                  data-state={
                    position < activeIndex ? "done" : position === activeIndex ? "running" : "queued"
                  }
                >
                  <span className="interface-step-dot" />
                  <span className="leading-snug">{stage.label}</span>
                </li>
              ))}
            </ol>

            <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <p
                className="text-[0.6875rem] uppercase font-bold mb-2.5"
                style={{ letterSpacing: "0.16em", color: "var(--text-tertiary)" }}
              >
                Settles by
              </p>
              <ul className="flex flex-col gap-1.5">
                {surface.settlement.map((option) => (
                  <li key={option} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What the reader is looking at, stated rather than left to the frame. */}
      <figcaption className="meta-line mt-4 max-w-2xl leading-relaxed lg:pr-[max(var(--gutter),6vw)]">
        {surface.caption}
      </figcaption>
    </figure>
  );
}
