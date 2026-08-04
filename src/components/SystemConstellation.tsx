"use client";

import Link from "@/components/Link";
import { useState } from "react";
import {
  CONSTELLATION_HEIGHT,
  CONSTELLATION_WIDTH,
  NODE_HEIGHT,
  NODE_WIDTH,
  labelRect,
  type ConstellationData,
  type ConstellationEdge,
  type ConstellationNode,
} from "@/lib/constellation";
import { StateGlyph, operatingStateStyles } from "./OperatingStatusBadge";
import { FamilyIcon, familyClass } from "./FamilyMark";
import { ArrowRight } from "./icons";

/**
 * The Sagitta network, drawn as a schematic.
 *
 * It is a wiring diagram, not a star map: boxes in three columns, one column
 * per family, joined by orthogonal wires that carry the relationship as a
 * printed label. Depth comes from hairlines and alignment — there is no glow,
 * no gradient wash, and no drop shadow anywhere in this component, per
 * `VISUAL_DIRECTION.md` §2.5.
 *
 * Accessibility and resilience were the constraints that shaped the build:
 *
 *   - Every node is a real `<a href="/systems/…">`. With scripting unavailable
 *     the graphic still renders and every node still navigates; the only thing
 *     lost is the detail panel, whose content is also in the structured list.
 *   - Selection follows focus as well as hover, so a keyboard user tabbing
 *     through the nodes drives the panel exactly as a mouse user does. Nothing
 *     is reachable by hover alone.
 *   - Below `lg` the SVG is replaced by a stacked network map rather than being
 *     shrunk. The same records, laid out for a narrow, touch-driven screen.
 *   - The structured list is the graphic's text alternative: on wide screens it
 *     is visually hidden but present for assistive technology; on narrow ones
 *     it *is* the presentation. Only one is ever in the accessibility tree.
 *   - The SVG wire layer is decorative and marked `aria-hidden`. Every
 *     relationship it draws is also stated in words in the list.
 */
export default function SystemConstellation({
  data,
  className = "",
}: {
  data: ConstellationData;
  className?: string;
}) {
  const { nodes, edges, families, columns } = data;
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = nodes.find((n) => n.slug === activeSlug) ?? null;

  const nodeBySlug = new Map(nodes.map((n) => [n.slug, n]));
  const isEdgeActive = (from: string, to: string) =>
    activeSlug !== null && (from === activeSlug || to === activeSlug);

  const connectionsFor = (slug: string) =>
    edges
      .filter((e) => e.from === slug || e.to === slug)
      .map((e) => ({
        other: nodeBySlug.get(e.from === slug ? e.to : e.from),
        reason: e.reason,
      }))
      .filter((c): c is { other: ConstellationNode; reason: string } => Boolean(c.other));

  return (
    <div className={className}>
      {/* ── Wide screens: the constellation itself ─────────────────────────── */}
      <div className="hidden lg:block">
        <figure className="m-0">
          <figcaption className="visually-hidden">
            A map of the {nodes.length} Sagitta systems, grouped into{" "}
            {families.length} strategic families and joined by {edges.length} documented
            relationships. The same information is listed in full below.
          </figcaption>

          <div
            className="relative w-full rounded-xl border overflow-hidden"
            style={{
              aspectRatio: `${CONSTELLATION_WIDTH} / ${CONSTELLATION_HEIGHT}`,
              backgroundColor: "var(--bg-raised)",
              borderColor: "var(--border)",
            }}
            onMouseLeave={() => setActiveSlug(null)}
          >
            {/* Wire layer. Decorative: every relationship is also in the list. */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${CONSTELLATION_WIDTH} ${CONSTELLATION_HEIGHT}`}
              fill="none"
            >
              <ColumnHeadings columns={columns} />

              {edges.map((edge) => (
                <Wire
                  key={`${edge.from}::${edge.to}`}
                  edge={edge}
                  on={isEdgeActive(edge.from, edge.to)}
                  dimmed={activeSlug !== null && !isEdgeActive(edge.from, edge.to)}
                />
              ))}
            </svg>

            {/* Node layer: real links, positioned over the wires. */}
            {nodes.map((node) => (
              <ConstellationNodeLink
                key={node.slug}
                node={node}
                active={node.slug === activeSlug}
                dimmed={activeSlug !== null && node.slug !== activeSlug}
                onActivate={() => setActiveSlug(node.slug)}
                onDeactivate={() => setActiveSlug(null)}
              />
            ))}
          </div>

          <DetailPanel
            active={active}
            nodeCount={nodes.length}
            edgeCount={edges.length}
            familyCount={families.length}
            connections={active ? connectionsFor(active.slug) : []}
          />
        </figure>
      </div>

      {/*
        One list, two jobs. Below `lg` it is the presentation — a stacked
        network map, readable and touch-friendly. From `lg` up the graphic above
        takes over and this becomes its text alternative, still in the
        accessibility tree but out of the visual layout. Rendering it once
        rather than twice keeps the markup honest: there is exactly one copy of
        each system in the document.
      */}
      <div className="alt-text-at-lg lg:mt-0 mt-0">
        <NetworkList data={data} connectionsFor={connectionsFor} />
      </div>
    </div>
  );
}

/**
 * A polyline as an SVG path with softened corners. Each corner is cut back by
 * `radius` along both of its runs and bridged with a quadratic curve — enough
 * to stop the joins reading as a pixel staircase, not enough to lose the right
 * angle that makes the diagram legible as a schematic.
 */
function orthogonalPath(points: [number, number][], radius = 8) {
  if (points.length < 2) return "";

  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length - 1; i += 1) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];

    const inLength = Math.hypot(cx - px, cy - py);
    const outLength = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, inLength / 2, outLength / 2);

    const entryX = cx - ((cx - px) / inLength) * r;
    const entryY = cy - ((cy - py) / inLength) * r;
    const exitX = cx + ((nx - cx) / outLength) * r;
    const exitY = cy + ((ny - cy) / outLength) * r;

    d += ` L ${entryX} ${entryY} Q ${cx} ${cy} ${exitX} ${exitY}`;
  }

  const [lastX, lastY] = points[points.length - 1];
  return `${d} L ${lastX} ${lastY}`;
}

/**
 * One wire, plus the relationship printed on it. The label sits in a knocked-out
 * rect so the wire breaks for the text rather than running through it — the
 * convention every wiring diagram uses, and the reason the schematic can state
 * eight relationships without a legend.
 */
function Wire({
  edge,
  on,
  dimmed,
}: {
  edge: ConstellationEdge;
  on: boolean;
  dimmed: boolean;
}) {
  const structural = edge.strength === "structural";
  const [labelX, labelY] = edge.label;
  const rect = labelRect(edge);

  /* Structural wires draw themselves in on load. Contextual ones stay static:
     their dash pattern carries the meaning (real, but secondary) and a trace
     animation would fight it for the same `stroke-dasharray`. */
  const length = Math.round(
    edge.points.reduce(
      (total, [x, y], i) =>
        i === 0 ? total : total + Math.hypot(x - edge.points[i - 1][0], y - edge.points[i - 1][1]),
      0,
    ),
  );

  return (
    <g
      opacity={on ? 1 : dimmed ? 0.22 : 1}
      style={{ transition: "opacity var(--duration-fast) var(--ease-out)" }}
    >
      <path
        d={orthogonalPath(edge.points)}
        className={structural ? "motion-trace" : undefined}
        style={
          structural ? ({ "--trace-length": `${length}` } as React.CSSProperties) : undefined
        }
        stroke={on ? "var(--gold)" : "var(--border-strong)"}
        strokeWidth={on ? 1.5 : 1}
        strokeDasharray={structural ? undefined : "4 4"}
        strokeLinecap="square"
        fill="none"
      />

      {edge.shortReason && (
        <>
          <rect
            x={rect.left}
            y={rect.top}
            width={rect.width}
            height={rect.height}
            fill="var(--bg-raised)"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9.5"
            letterSpacing="0.02em"
            fill={on ? "var(--gold)" : "var(--text-tertiary)"}
          >
            {edge.shortReason}
          </text>
        </>
      )}
    </g>
  );
}

/** A family name over each column. The column *is* the family, so nothing below
 *  needs to repeat it and the old colour legend is gone. */
function ColumnHeadings({ columns }: { columns: ConstellationData["columns"] }) {
  return (
    <g>
      {columns.map((column) => (
        <g key={column.id} className={familyClass(column.id)}>
          <text
            x={column.x}
            y={26}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.14em"
            fill="var(--family-accent)"
          >
            {column.shortName.toUpperCase()}
          </text>
          <line
            x1={column.x - NODE_WIDTH / 2}
            y1={36}
            x2={column.x + NODE_WIDTH / 2}
            y2={36}
            stroke="var(--border)"
            strokeWidth="1"
          />
        </g>
      ))}
    </g>
  );
}

function ConstellationNodeLink({
  node,
  active,
  dimmed,
  onActivate,
  onDeactivate,
}: {
  node: ConstellationNode;
  active: boolean;
  dimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  return (
    <Link
      href={`/systems/${node.slug}`}
      data-cta={`constellation:${node.slug}`}
      data-cta-type="system-entry"
      data-testid="constellation-node"
      data-slug={node.slug}
      className={`${familyClass(node.family)} absolute flex flex-col justify-center gap-1 rounded-md overflow-hidden`}
      style={{
        left: `${((node.x - NODE_WIDTH / 2) / CONSTELLATION_WIDTH) * 100}%`,
        top: `${((node.y - NODE_HEIGHT / 2) / CONSTELLATION_HEIGHT) * 100}%`,
        width: `${(NODE_WIDTH / CONSTELLATION_WIDTH) * 100}%`,
        height: `${(NODE_HEIGHT / CONSTELLATION_HEIGHT) * 100}%`,
        paddingInline: "0.75rem",
        backgroundColor: active ? "var(--surface-2)" : "var(--surface)",
        /* The family reads off the left rule; the border stays neutral until
           the box is the selected one, so exactly one thing on the diagram is
           ever gold. No shadow, no halo. */
        border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
        borderLeft: `2px solid ${active ? "var(--gold)" : "var(--family-accent)"}`,
        opacity: dimmed ? 0.5 : 1,
        transition:
          "opacity var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out)",
      }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onMouseLeave={onDeactivate}
      onBlur={onDeactivate}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span style={{ color: "var(--family-accent)" }} className="shrink-0">
          <FamilyIcon motif={node.motif} size={13} />
        </span>
        <span
          className="text-sm font-semibold leading-tight truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {node.shortName}
        </span>
      </span>

      <span className="inline-flex items-center gap-1.5">
        <StateGlyph state={node.status} size={6} />
        <span
          className="text-[10px] leading-none"
          style={{ color: operatingStateStyles[node.status].color }}
        >
          {node.status}
        </span>
      </span>
    </Link>
  );
}

/**
 * The panel beneath the graphic. Its initial state describes the network as a
 * whole, so the component says something meaningful before any interaction —
 * and says it again whenever selection is released.
 */
function DetailPanel({
  active,
  nodeCount,
  edgeCount,
  familyCount,
  connections,
}: {
  active: ConstellationNode | null;
  nodeCount: number;
  edgeCount: number;
  familyCount: number;
  connections: { other: ConstellationNode; reason: string }[];
}) {
  return (
    <div
      aria-live="polite"
      className={`${active ? familyClass(active.family) : ""} mt-4 rounded-xl border p-5 min-h-[128px]`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        borderLeft: "2px solid var(--family-accent)",
      }}
    >
      {!active ? (
        <>
          <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
            {nodeCount} systems, {familyCount} families, {edgeCount} documented links
          </p>
          <p className="text-xs leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Continuity keeps a protocol alive, allocation decides what it does, and capital
            infrastructure holds and moves what it decides on. Point at a node — or tab through
            them — to read what it is and what it connects to. Every node opens its system record.
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {active.name}
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs"
              style={{ color: "var(--family-accent)" }}
            >
              <FamilyIcon motif={active.motif} size={12} />
              {active.familyName}
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs"
              style={{ color: operatingStateStyles[active.status].color }}
            >
              <StateGlyph state={active.status} size={7} />
              {active.status}
            </span>
          </div>

          <p className="text-xs leading-relaxed max-w-2xl mb-3" style={{ color: "var(--text-secondary)" }}>
            {active.summary}
          </p>

          {connections.length > 0 && (
            <p className="text-xs leading-relaxed max-w-2xl" style={{ color: "var(--text-tertiary)" }}>
              Connects to{" "}
              {connections.map((c, i) => (
                <span key={c.other.slug}>
                  {i > 0 && (i === connections.length - 1 ? " and " : ", ")}
                  <span style={{ color: "var(--text-secondary)" }}>{c.other.name}</span>
                </span>
              ))}
              .
            </p>
          )}
        </>
      )}
    </div>
  );
}

/**
 * The network as structured text, grouped by family. This is both the graphic's
 * accessible equivalent and, below `lg`, the presentation itself.
 */
function NetworkList({
  data,
  connectionsFor,
}: {
  data: ConstellationData;
  connectionsFor: (slug: string) => { other: ConstellationNode; reason: string }[];
}) {
  return (
    <div className="space-y-8">
      {data.families.map((family) => {
        const members = data.nodes.filter((n) => n.family === family.id);
        return (
          <section key={family.id} className={familyClass(family.id)}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: "var(--family-accent)" }}>
                <FamilyIcon motif={family.motif} size={15} />
              </span>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {family.name}
              </h3>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {members.length} systems
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((node) => {
                const connections = connectionsFor(node.slug);
                return (
                  <li key={node.slug}>
                    <Link
                      href={`/systems/${node.slug}`}
                      data-cta={`constellation-list:${node.slug}`}
                      data-cta-type="system-entry"
                      data-testid="constellation-list-node"
                      data-slug={node.slug}
                      className="surface-card family-card tap-target block rounded-lg border p-4"
                    >
                      <span className="flex items-start justify-between gap-3 mb-1.5">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {node.name}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs shrink-0"
                          style={{ color: operatingStateStyles[node.status].color }}
                        >
                          <StateGlyph state={node.status} size={7} />
                          {node.status}
                        </span>
                      </span>

                      <span
                        className="block text-xs leading-relaxed mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {node.summary}
                      </span>

                      {connections.length > 0 && (
                        <span
                          className="block text-xs leading-relaxed"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          Connects to{" "}
                          {connections.map((c, i) => (
                            <span key={c.other.slug}>
                              {i > 0 && (i === connections.length - 1 ? " and " : ", ")}
                              {c.other.name}
                            </span>
                          ))}
                          .
                        </span>
                      )}

                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold mt-3"
                        style={{ color: "var(--family-accent)" }}
                      >
                        System record
                        <ArrowRight size={12} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
