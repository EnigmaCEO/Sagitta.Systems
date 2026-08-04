import Link from "@/components/Link";
import { formatDate, getSystemName, headlineFor } from "@/content";
import type { PromotionRecord } from "@/content/types";
import { ArrowRight, ExternalArrow } from "./icons";

/**
 * From the network — an editorial desk.
 *
 * The quietest stage on the page and the only purely typographic one: after a
 * cinematic opening, a live data line, a running interface, and a programme
 * poster, this is where the page stops showing and starts reading.
 *
 * The leading item is given real scale because editorial priority supports it,
 * and the rest follow as rows. Each states where the material lives, what it
 * says, when it was published, and which system it belongs to. Nothing is put
 * in a card: converting a research note into a bordered rectangle would flatten
 * the difference between the mediums the rest of the page works to preserve.
 *
 * Rows only appear for material with a real destination. A channel Sagitta does
 * not yet publish on contributes nothing here rather than a simulated preview.
 */
export default function NetworkHeadlines({
  promotions,
  action,
}: {
  promotions: PromotionRecord[];
  /** Where the full record lives. */
  action?: { label: string; href: string };
}) {
  if (promotions.length === 0) return null;

  const [lead, ...rest] = promotions;

  return (
    <section id="network" aria-labelledby="network-heading" className="relative py-24 md:py-32">
      <div className="canvas">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 mb-12">
          <h2 id="network-heading" className="stage-eyebrow">
            From the network
          </h2>
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1.5 meta-line font-semibold hover:opacity-80 transition-opacity duration-150"
              style={{ color: "var(--gold)" }}
            >
              {action.label}
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-4">
          {/* The lead item, at the scale its priority earns. */}
          <div className="lg:col-span-5">
            <DeskItem promotion={lead} lead />
          </div>

          {/* The supporting rows. */}
          <ul className="lg:col-span-7">
            {rest.map((promotion) => (
              <li key={promotion.id} className="desk-row">
                <DeskItem promotion={promotion} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * One item on the desk. The lead runs as a stacked block with a large headline;
 * the rest run as rows. Both carry the same four facts and the same link.
 */
function DeskItem({ promotion, lead = false }: { promotion: PromotionRecord; lead?: boolean }) {
  const system = getSystemName(promotion.systemSlugs[0]);
  const external = Boolean(promotion.action.external);

  // The desk is the page's most compact stage, so it is the one place an
  // approved shorter headline may be set. Where one is, the canonical title is
  // still announced — the reader loses the line length, never the title.
  const { text, canonical } = headlineFor(promotion, true);
  const title = (
    <>
      {text}
      {canonical && (
        <span className="visually-hidden">. Published as: {canonical}</span>
      )}
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </>
  );

  const date = promotion.publishedAt ? (
    <time dateTime={promotion.publishedAt}>{formatDate(promotion.publishedAt)}</time>
  ) : (
    <span>Undated</span>
  );

  // The source label. Deliberately the promotion's own eyebrow — the compact
  // identity the record publishes itself under — rather than a logo.
  const source = (
    <span className="inline-flex items-center gap-1.5">
      {promotion.eyebrow}
      {external && <ExternalArrow size={9} />}
    </span>
  );

  const body = lead ? (
    <div className="py-6">
      <p className="meta-line mb-5">{source}</p>
      <h3 className="desk-lead-headline mb-6">{title}</h3>
      <p className="meta-line flex flex-wrap items-center gap-x-2">
        {date}
        {system && (
          <>
            <span aria-hidden="true">·</span>
            <span>{system}</span>
          </>
        )}
        <span className="desk-cue ml-1" aria-hidden="true">
          <ArrowRight size={12} />
        </span>
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-2 py-6">
      <p className="meta-line md:col-span-3 md:pt-1.5">{source}</p>
      <h3 className="desk-headline md:col-span-5">{title}</h3>
      {/* Four columns. Three held a two-word system name and broke a longer
          one: "Sagitta Continuity Engine" and "Autonomous Allocation Agent"
          both set to three lines and collided with the headline beside them.
          The headline gives up the column, because a headline wraps gracefully
          and a right-aligned metadata stack does not. */}
      <p className="meta-line md:col-span-4 md:text-right md:pt-1.5 flex md:justify-end items-center gap-2">
        <span>
          {date}
          {system && (
            <>
              <span className="hidden md:inline">
                <br />
              </span>
              <span className="md:hidden" aria-hidden="true">
                {" · "}
              </span>
              {system}
            </>
          )}
        </span>
        <span className="desk-cue" aria-hidden="true">
          <ArrowRight size={12} />
        </span>
      </p>
    </div>
  );

  const shared = {
    "data-cta": promotion.action.id,
    "data-cta-type": promotion.action.type,
    "data-cta-availability": promotion.action.availability,
    className: "block group",
  };

  const inner = external ? (
    <a {...shared} href={promotion.action.href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <Link {...shared} href={promotion.action.href}>
      {body}
    </Link>
  );

  // The lead is its own row so its rule and hover behaviour match the list; the
  // modifier is what marks it as the desk's lead rather than extra chrome.
  return lead ? <div className="desk-row desk-row-lead">{inner}</div> : inner;
}
