import Link from "@/components/Link";
import { publicSystems } from "@/content/systems";
import { familyClass } from "./FamilyMark";
import SystemMark from "./SystemMark";

/**
 * A continuously scrolling rail of every system's mark.
 *
 * This is promotion, not navigation. The directory below already lists all
 * eight systems with their state, family, and actions; the rail exists so the
 * page shows the portfolio before it explains it, and so a reader who scans
 * rather than reads still leaves knowing the network has breadth.
 *
 * ── Why the marks survive being shown together ───────────────────────────────
 *
 * The eight assets are not a matched set: Radar, Defense, SCE and Protocol are
 * glossy gold/purple emblems, AAA is a flat grey glyph, Selun is a cyan SVG,
 * Banking has only a horizontal lockup, and Wallet has no asset at all. Shown
 * at full strength in a row, that inconsistency is the loudest thing on screen.
 *
 * So nothing sits at full strength at rest: the rail renders desaturated and
 * dimmed, which pulls the palettes toward each other, and an individual mark
 * lifts to full colour on hover or keyboard focus. `SystemMark` handles the
 * shape problem on its own — a fixed slot contains a square mark or a lockup
 * without distorting either, and falls back to the family motif for Wallet.
 *
 * ── Motion ───────────────────────────────────────────────────────────────────
 *
 * The track holds two identical copies of the list and translates by exactly
 * -50%, so the seam lands where the second copy's first item sits on top of the
 * first copy's — the loop is continuous with no jump. Only the first copy is
 * reachable; the duplicate is inert and hidden from assistive tech.
 *
 * Scrolling stops on hover and on focus-within, so a reader can actually aim at
 * a mark, and `prefers-reduced-motion` halts it outright via globals.css.
 */
export default function SystemTicker() {
  // Two copies back to back. The duplicate is presentational only — it carries
  // no links and no accessible name, so the rail reads as eight items, not
  // sixteen.
  const marks = publicSystems.map((system) => (
    <Link
      key={system.slug}
      href={`/systems/${system.slug}`}
      data-cta={`system-ticker:${system.slug}`}
      data-cta-type="system-entry"
      title={system.name}
      className={`${familyClass(system.family)} sag-ticker-item shrink-0 inline-flex items-center gap-3 px-6`}
    >
      <SystemMark systemSlug={system.slug} height={34} />
      <span
        className="text-xs font-medium whitespace-nowrap"
        style={{ color: "var(--text-secondary)" }}
      >
        {system.name}
      </span>
    </Link>
  ));

  return (
    <div
      className="sag-ticker relative overflow-hidden py-6 border-y"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="sag-ticker-track flex items-center w-max">
        {marks}
        <div aria-hidden="true" className="flex items-center pointer-events-none">
          {publicSystems.map((system) => (
            <span
              key={`dup-${system.slug}`}
              className={`${familyClass(system.family)} sag-ticker-item shrink-0 inline-flex items-center gap-3 px-6`}
            >
              <SystemMark systemSlug={system.slug} height={34} />
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: "var(--text-secondary)" }}
              >
                {system.name}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Edge fades, so marks enter and leave the rail rather than being cut
          off at a hard border. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{ background: "linear-gradient(to left, var(--bg), transparent)" }}
      />
    </div>
  );
}
