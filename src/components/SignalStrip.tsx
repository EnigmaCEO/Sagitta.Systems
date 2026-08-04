import Link from "@/components/Link";
import { formatDate, getSystemName } from "@/content";
import type { PromotionRecord } from "@/content/types";
import { ExternalArrow } from "./icons";

/**
 * Current signals, as a live information line.
 *
 * This is the change of pace between the cinematic opening and the product
 * stage: the fastest, lightest surface on the page. One horizontal sequence of
 * figures on desktop, running wider than any text column; a snapping horizontal
 * scroll on small screens, which is the one place lateral movement belongs
 * because the content is genuinely sequential. Fine rules and spacing carry the
 * structure — there are no boxes here.
 *
 * Two kinds of figure run here and they are labelled differently, because they
 * are different claims. A `snapshot` is a moving value read once: it renders
 * with its as-of date and the word snapshot, so a point-in-time reading is
 * never mistaken for a live one. A `rollup` is a standing figure the operating
 * surface keeps current: it renders as live, with no date, because it was never
 * frozen and dating it would be an invention.
 *
 * A signal with no verified current source is not published at all — the row is
 * absent rather than empty.
 */
export default function SignalStrip({ promotions }: { promotions: PromotionRecord[] }) {
  if (promotions.length === 0) return null;

  return (
    <section id="signals" aria-labelledby="signals-heading">
      <div className="canvas pt-14 pb-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 id="signals-heading" className="stage-eyebrow">
          Current signals
        </h2>
        {/* This line used to promise every figure carried a read date. Two of
            them are live rollups the product keeps current and were never
            frozen, so the promise is now the accurate one: each figure states
            which kind it is. */}
        <p className="meta-line">
          Read from the surfaces that publish them. Each states whether it is live or a dated
          snapshot.
        </p>
      </div>

      <div className="ticker">
        {/* Wider than the text column, and the only laterally scrolling
            surface on the page — and only below 900px, where the four figures
            genuinely do not fit. */}
        <div className="canvas ticker-scroll">
          <ul className="ticker-track">
            {promotions.map((promotion) => {
              const signal = promotion.signal;
              const system = getSystemName(promotion.systemSlugs[0]);
              const external = Boolean(promotion.action.external);
              const linkClass = "ticker-link inline-flex items-center gap-1.5 text-xs font-semibold";

              return (
                <li key={promotion.id} className="ticker-item">
                  <p className="flex items-center gap-2 mb-3">
                    <span aria-hidden="true" className="ticker-pulse motion-pulse" />
                    <span
                      className="text-[0.6875rem] uppercase font-semibold"
                      style={{ letterSpacing: "0.18em", color: "var(--text-tertiary)" }}
                    >
                      {promotion.eyebrow}
                    </span>
                  </p>

                  <p className="ticker-value mb-3">{signal ? signal.value : "—"}</p>

                  <p className="text-sm leading-snug mb-2" style={{ color: "var(--text-secondary)" }}>
                    {signal ? signal.metric : promotion.headline}
                  </p>

                  <p className="meta-line mb-4">
                    {signal?.reading === "snapshot" && signal.asOf ? (
                      <>
                        Snapshot as of{" "}
                        <time dateTime={signal.asOf}>{formatDate(signal.asOf)}</time>
                        <span aria-hidden="true"> · </span>
                      </>
                    ) : signal?.reading === "rollup" ? (
                      <>
                        Live from the product
                        <span aria-hidden="true"> · </span>
                      </>
                    ) : null}
                    {system ?? promotion.sourceName}
                  </p>

                  {external ? (
                    <a
                      href={promotion.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta={promotion.action.id}
                      data-cta-type={promotion.action.type}
                      data-cta-availability={promotion.action.availability}
                      className={linkClass}
                    >
                      {promotion.action.label}
                      <ExternalArrow size={10} />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link
                      href={promotion.action.href}
                      data-cta={promotion.action.id}
                      data-cta-type={promotion.action.type}
                      data-cta-availability={promotion.action.availability}
                      className={linkClass}
                    >
                      {promotion.action.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
