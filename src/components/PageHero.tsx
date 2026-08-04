import Link from "@/components/Link";
import type { ContentAction, SystemFamily } from "@/content/types";
import CtaLink from "./CtaLink";
import { FamilyBackdrop, familyClass } from "./FamilyMark";
import { ArrowRight, ExternalArrow } from "./icons";

export interface PageHeroAction {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary";
  /** Stable analytics identifier, emitted as `data-cta`. */
  cta?: string;
  ctaType?: string;
}

/**
 * Standard page opening: eyebrow, title, lead paragraph, actions.
 *
 * Passing a `family` scopes the hero's accent and paints that family's motif
 * behind it, which is how a system page announces its family before the reader
 * has processed a single word.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  actions = [],
  contentActions,
  meta,
  aside,
  family,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Ad-hoc actions for pages with no content-layer action record. */
  actions?: PageHeroAction[];
  /** State-aware actions from the content layer. Takes precedence. */
  contentActions?: { primary: ContentAction; secondary?: ContentAction };
  /** Small metadata line rendered under the lead. */
  meta?: React.ReactNode;
  /** Optional right-hand column, e.g. a record summary or a graphic. */
  aside?: React.ReactNode;
  family?: SystemFamily;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`hero-section ${familyClass(family?.id)}`}
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* The lattice sits under the family's own motif art, not over it: the
          hexagons are the structure the page rests on, and the motif is the
          thing standing on it. On a route with no family this is the only
          figure in the band, tinted with the gold default. */}
      <span aria-hidden="true" className="atmosphere lattice lattice-hero" />

      {family && <FamilyBackdrop motif={family.motif} />}

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className={aside ? "grid grid-cols-1 lg:grid-cols-3 gap-10" : undefined}>
          <div className={aside ? "lg:col-span-2" : undefined}>
            <p className="eyebrow mb-3 motion-rise">{eyebrow}</p>
            <h1
              className="display text-3xl md:text-4xl font-bold mb-4 max-w-3xl motion-rise"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h1>
            {lead && (
              <p
                className="text-sm md:text-base leading-relaxed max-w-2xl motion-rise-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {lead}
              </p>
            )}
            {meta && <div className="mt-5 motion-rise-2">{meta}</div>}

            {contentActions ? (
              <div className="mt-8 motion-rise-3">
                <div className="flex flex-wrap gap-3">
                  <CtaLink action={contentActions.primary} variant="primary" />
                  {contentActions.secondary && (
                    <CtaLink action={contentActions.secondary} variant="secondary" />
                  )}
                </div>
                {contentActions.primary.note && (
                  <p
                    className="text-xs leading-relaxed mt-3 max-w-lg"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {contentActions.primary.note}
                  </p>
                )}
              </div>
            ) : (
              actions.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-8 motion-rise-3">
                  {actions.map((action) => {
                    const className =
                      action.variant === "secondary"
                        ? "btn-secondary tap-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold"
                        : "btn-primary tap-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold";
                    const attrs = {
                      className,
                      ...(action.cta ? { "data-cta": action.cta } : {}),
                      ...(action.ctaType ? { "data-cta-type": action.ctaType } : {}),
                    };
                    return action.external ? (
                      <a
                        key={action.label}
                        {...attrs}
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {action.label}
                        <ExternalArrow size={12} />
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link key={action.label} {...attrs} href={action.href}>
                        {action.label}
                        <ArrowRight />
                      </Link>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {aside && <div className="lg:col-span-1 motion-rise-3">{aside}</div>}
        </div>

        {children && <div className="mt-10 motion-rise-3">{children}</div>}
      </div>
    </section>
  );
}
