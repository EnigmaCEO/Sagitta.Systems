import Link from "@/components/Link";
import type { EditorialDesk, NewsroomEntry } from "@/content/types";
import { formatDateOrUndated, newsroomEntryPath } from "@/content";
import { getSystem } from "@/content/systems";
import { familyClass } from "./FamilyMark";
import MediaTypeBadge from "./MediaTypeBadge";
import { ArrowRight } from "./icons";

/**
 * The editorial spine, presented as a publishing map.
 *
 * Active desks and upcoming desks are separated rather than interleaved,
 * because the difference is the whole point: an active desk shows what it has
 * published and when, while an upcoming desk shows only its intended cadence
 * and format and says outright that it has not published. No upcoming desk ever
 * generates a story card or implies an unwritten edition exists.
 */
export default function EditorialSchedule({
  desks,
  entries,
}: {
  desks: EditorialDesk[];
  entries: NewsroomEntry[];
}) {
  const active = desks.filter((d) => d.state === "active");
  const upcoming = desks.filter((d) => d.state === "upcoming");

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-baseline gap-3 mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Publishing
          </h3>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {active.length} {active.length === 1 ? "desk" : "desks"} · {entries.length} records
          </span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((desk) => {
            const deskEntries = entries.filter((e) => e.desk === desk.id);
            const latest = deskEntries[0];
            const family = desk.systemSlug ? getSystem(desk.systemSlug)?.family : undefined;

            return (
              <li
                key={desk.id}
                className={`${familyClass(family)} surface-card family-card rounded-xl border p-5 h-full flex flex-col`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {desk.name}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs shrink-0"
                    style={{ color: "var(--state-operating)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block w-1.5 h-1.5 rounded-full motion-pulse"
                      style={{ backgroundColor: "var(--state-operating)" }}
                    />
                    Active
                  </span>
                </div>

                <p
                  className="text-xs leading-relaxed mb-4 flex-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {desk.summary}
                </p>

                <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
                  {desk.cadence} · {desk.format} ·{" "}
                  <span style={{ color: "var(--text-secondary)" }}>
                    {deskEntries.length} {deskEntries.length === 1 ? "record" : "records"}
                  </span>
                </p>

                {latest && (
                  <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="eyebrow mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                      Latest
                    </p>
                    <Link
                      href={newsroomEntryPath(latest)}
                      className="text-xs font-medium leading-snug block mb-1.5 transition-opacity duration-150 hover:opacity-80"
                      style={{ color: "var(--family-accent)" }}
                    >
                      {latest.title}
                    </Link>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {formatDateOrUndated(latest.publishedAt)}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {upcoming.length > 0 && (
        <section>
          <div className="flex items-baseline gap-3 mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Preparing
            </h3>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {upcoming.length} {upcoming.length === 1 ? "desk" : "desks"} · nothing published yet
            </span>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upcoming.map((desk) => (
              <li
                key={desk.id}
                className="rounded-xl border p-5 h-full flex flex-col"
                style={{ borderColor: "var(--border)", borderStyle: "dashed" }}
              >
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                  {desk.name}
                </p>
                <p
                  className="text-xs leading-relaxed mb-4 flex-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {desk.summary}
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
                  Planned: {desk.cadence} · {desk.format}
                </p>
                <p
                  className="text-xs pt-3 border-t"
                  style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}
                >
                  This desk has not published yet.
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/**
 * Media types with published records behind them, shown as a coverage strip.
 * A type with nothing published is deliberately absent rather than greyed out.
 */
export function MediaCoverage({ entries }: { entries: NewsroomEntry[] }) {
  const counts = new Map<NewsroomEntry["mediaType"], number>();
  for (const entry of entries) {
    counts.set(entry.mediaType, (counts.get(entry.mediaType) ?? 0) + 1);
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {[...counts.entries()].map(([type, count]) => (
        <li key={type} className="inline-flex items-center gap-1.5">
          <MediaTypeBadge type={type} size="sm" />
          <span className="text-xs tabular-nums" style={{ color: "var(--text-tertiary)" }}>
            {count}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Small link into the full editorial schedule. */
export function ScheduleLink() {
  return (
    <Link
      href="/newsroom#schedule"
      className="inline-flex items-center gap-1.5 text-xs font-semibold"
      style={{ color: "var(--family-accent)" }}
    >
      See the editorial schedule
      <ArrowRight size={12} />
    </Link>
  );
}
