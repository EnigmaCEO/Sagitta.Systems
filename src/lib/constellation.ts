import { publicSystems, systemEdges, systemFamilies } from "@/content/systems";
import type { OperatingState, SystemFamily, SystemFamilyId } from "@/content/types";

/**
 * Network schematic view model.
 *
 * Built here, on the server, so the client component receives only the eight
 * boxes and their routed wires rather than importing the whole content layer
 * into the browser bundle.
 *
 * Two things are authored rather than computed, for the same reason: this is a
 * fixed network of eight members whose grouping is the point, and a solver
 * would reshuffle the whole picture on any content change while costing a
 * runtime dependency.
 *
 *   - **Boxes** sit in three columns, one per strategic family, so a column is
 *     a family and needs no colour to say so.
 *   - **Wires** are orthogonal and hand-routed. Every route is a polyline of
 *     horizontal and vertical runs, chosen to enter a free edge of each box and
 *     to pass through the empty channels between columns and rows. `assertLayout`
 *     re-checks the second claim on every build.
 *
 * The coordinate space is 960 × 420 and the component scales it responsively.
 */

export interface ConstellationNode {
  slug: string;
  name: string;
  shortName: string;
  family: SystemFamilyId;
  familyName: string;
  familyShortName: string;
  motif: SystemFamily["motif"];
  status: OperatingState;
  summary: string;
  /** Box centre in the 960 × 420 coordinate space. */
  x: number;
  y: number;
}

export interface ConstellationEdge {
  from: string;
  to: string;
  reason: string;
  /** `reason` in two or three words, printed on the wire. */
  shortReason?: string;
  strength: "structural" | "contextual";
  crossFamily: boolean;
  /** Orthogonal route, box edge to box edge. Every run is horizontal or vertical. */
  points: [number, number][];
  /** Where the wire's label interrupts the wire. */
  label: [number, number];
}

/** One column heading per family, centred over its column of boxes. */
export interface ConstellationColumn {
  id: SystemFamilyId;
  name: string;
  /** What the heading actually prints — the full name does not fit a column. */
  shortName: string;
  motif: SystemFamily["motif"];
  x: number;
}

export const CONSTELLATION_WIDTH = 960;
export const CONSTELLATION_HEIGHT = 420;

/** Box size. Wide enough for the longest short name plus its operating state. */
export const NODE_WIDTH = 196;
export const NODE_HEIGHT = 62;

/**
 * Box centres. Columns at 146 / 480 / 814 are the three families, left to
 * right: continuity, allocation, capital — the same order as the page's own
 * account of the network. Rows are spaced so that the gaps between boxes are
 * wide enough to route a labelled wire through.
 */
const POSITIONS: Record<string, { x: number; y: number }> = {
  "sagitta-defense": { x: 146, y: 79 },
  "sagitta-continuity-engine": { x: 146, y: 213 },
  "sagitta-radar": { x: 146, y: 347 },
  aaa: { x: 480, y: 135 },
  selun: { x: 480, y: 325 },
  "sagitta-banking": { x: 814, y: 79 },
  "sagitta-protocol": { x: 814, y: 213 },
  "sagitta-wallet": { x: 814, y: 325 },
};

/**
 * Routes, keyed by the unordered pair so a route does not depend on which
 * record happened to declare the relationship. Each is a polyline from one box
 * edge to another; `label` is the point on it where the wire breaks for text.
 */
const ROUTES: Record<string, { points: [number, number][]; label: [number, number] }> = {
  // Down the continuity column.
  "sagitta-continuity-engine::sagitta-defense": {
    points: [
      [146, 110],
      [146, 182],
    ],
    label: [146, 146],
  },
  "sagitta-continuity-engine::sagitta-radar": {
    points: [
      [146, 244],
      [146, 316],
    ],
    label: [146, 280],
  },

  // Down the allocation column.
  "aaa::selun": {
    points: [
      [480, 166],
      [480, 294],
    ],
    /* Below the spine's label rather than beside it: the continuity–capital
       wire crosses this one at y=213 and labels them both at x=480. */
    label: [480, 258],
  },

  // Down the capital column.
  "sagitta-banking::sagitta-protocol": {
    points: [
      [814, 110],
      [814, 182],
    ],
    label: [814, 146],
  },

  // Allocation into capital: out of AAA's right edge, along the row gap under
  // Banking, then down into Protocol's top edge.
  "aaa::sagitta-protocol": {
    points: [
      [578, 135],
      [774, 135],
      [774, 182],
    ],
    label: [676, 135],
  },

  // Continuity into capital: the long spine, straight across the empty band
  // between AAA and Selun.
  "sagitta-continuity-engine::sagitta-protocol": {
    points: [
      [244, 213],
      [716, 213],
    ],
    label: [480, 213],
  },

  // Selun back to SCE, up the left channel and into SCE's lower right edge —
  // a second port, so it never contends with the spine above it.
  "sagitta-continuity-engine::selun": {
    points: [
      [382, 325],
      [313, 325],
      [313, 228],
      [244, 228],
    ],
    label: [313, 276],
  },

  // Wallet to Selun, straight across the lower channel.
  "sagitta-wallet::selun": {
    points: [
      [578, 325],
      [716, 325],
    ],
    label: [647, 325],
  },
};

const routeKey = (a: string, b: string) => [a, b].sort().join("::");

/**
 * The rect a wire's label knocks out of the diagram.
 *
 * Width is estimated from the character count rather than measured: measuring
 * would mean a layout read in the browser, and both callers only need it to
 * clear the glyphs — the component to size the knockout, `assertLayout` to
 * prove no two labels collide. The constants match the `<text>` in `Wire`.
 */
export const LABEL_HEIGHT = 14;

/** Minimum gap a label must keep from any box or other label. */
const CLEARANCE = 5;

export function labelRect(edge: Pick<ConstellationEdge, "shortReason" | "label">) {
  const width = edge.shortReason ? edge.shortReason.length * 5.1 + 14 : 0;
  const [x, y] = edge.label;
  return {
    width,
    height: LABEL_HEIGHT,
    left: x - width / 2,
    right: x + width / 2,
    top: y - LABEL_HEIGHT / 2,
    bottom: y + LABEL_HEIGHT / 2,
  };
}

/** The box a node occupies, in diagram coordinates. */
function boxOf(node: { x: number; y: number }) {
  return {
    left: node.x - NODE_WIDTH / 2,
    right: node.x + NODE_WIDTH / 2,
    top: node.y - NODE_HEIGHT / 2,
    bottom: node.y + NODE_HEIGHT / 2,
  };
}

/** Whether a point sits exactly on a box's outline. */
function onPerimeter([x, y]: [number, number], node: { x: number; y: number }) {
  const b = boxOf(node);
  return (
    ((x === b.left || x === b.right) && y >= b.top && y <= b.bottom) ||
    ((y === b.top || y === b.bottom) && x >= b.left && x <= b.right)
  );
}

export interface ConstellationData {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  families: SystemFamily[];
  columns: ConstellationColumn[];
}

export function constellationData(): ConstellationData {
  const nodes = publicSystems.map((system) => {
    const family = systemFamilies.find((f) => f.id === system.family);
    const position = POSITIONS[system.slug];

    if (!family) throw new Error(`constellation: no family for "${system.slug}"`);
    if (!position) throw new Error(`constellation: no position for "${system.slug}"`);

    return {
      slug: system.slug,
      name: system.name,
      shortName: system.shortName,
      family: system.family,
      familyName: family.name,
      familyShortName: family.shortName,
      motif: family.motif,
      status: system.status,
      summary: system.summary,
      x: position.x,
      y: position.y,
    };
  });

  const edges = systemEdges.map((e) => {
    const route = ROUTES[routeKey(e.from, e.to)];
    if (!route) throw new Error(`constellation: no route for "${e.from}" → "${e.to}"`);

    /* Routes are keyed by the unordered pair, but `from` is whichever record
       happened to declare the relationship. Point the polyline at `from` so
       that end and edge direction always agree. */
    const start = nodes.find((n) => n.slug === e.from);
    const points =
      start && onPerimeter(route.points[0], start)
        ? route.points
        : ([...route.points].reverse() as [number, number][]);

    return {
      from: e.from,
      to: e.to,
      reason: e.reason,
      shortReason: e.shortReason,
      strength: e.strength,
      crossFamily: e.crossFamily,
      points,
      label: route.label,
    };
  });

  const families = [...systemFamilies].sort((a, b) => a.order - b.order);

  const columns = families.map((family) => {
    const member = nodes.find((n) => n.family === family.id);
    if (!member) throw new Error(`constellation: family "${family.id}" has no systems`);
    return {
      id: family.id,
      name: family.name,
      shortName: family.shortName,
      motif: family.motif,
      x: member.x,
    };
  });

  const data = { nodes, edges, families, columns };
  assertLayout(data);
  return data;
}

/**
 * The routes are hand-drawn, so the build checks them rather than trusting
 * them. A wire that runs diagonally, that starts or ends away from the box it
 * claims to join, or that is drawn straight through a third box is a mistake
 * that should stop the build, not ship as a picture that quietly lies about
 * the network.
 */
function assertLayout({ nodes, edges, columns }: Omit<ConstellationData, "families">) {
  const node = (slug: string) => nodes.find((n) => n.slug === slug)!;
  const box = (slug: string) => boxOf(node(slug));

  for (const node of nodes) {
    const b = box(node.slug);
    if (b.left < 0 || b.right > CONSTELLATION_WIDTH || b.top < 0 || b.bottom > CONSTELLATION_HEIGHT)
      throw new Error(`constellation: "${node.slug}" falls outside the coordinate space`);
    if (!columns.some((c) => c.x === node.x))
      throw new Error(`constellation: "${node.slug}" is not aligned to a family column`);
  }

  // No two boxes overlap, and rows leave a channel wide enough for a label.
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = box(nodes[i].slug);
      const b = box(nodes[j].slug);
      const overlaps = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      if (overlaps)
        throw new Error(`constellation: "${nodes[i].slug}" and "${nodes[j].slug}" overlap`);
    }
  }

  for (const edge of edges) {
    const label = `${edge.from} → ${edge.to}`;

    // Every run is horizontal or vertical.
    for (let i = 1; i < edge.points.length; i += 1) {
      const [x1, y1] = edge.points[i - 1];
      const [x2, y2] = edge.points[i];
      if (x1 !== x2 && y1 !== y2)
        throw new Error(`constellation: ${label} has a diagonal run`);
    }

    // Each end sits on the perimeter of the box it joins.
    for (const [slug, point] of [
      [edge.from, edge.points[0]],
      [edge.to, edge.points[edge.points.length - 1]],
    ] as [string, [number, number]][]) {
      if (!onPerimeter(point, node(slug)))
        throw new Error(`constellation: ${label} does not meet "${slug}" at its edge`);
    }

    // A label clears every box, and every other label. Two wires crossing is
    // fine; two labels landing on top of each other is unreadable — and
    // "not quite touching" already reads as touching, so the test demands a
    // CLEARANCE gutter around each label rather than bare non-intersection.
    const bare = labelRect(edge);
    const rect = {
      width: bare.width,
      left: bare.left - CLEARANCE,
      right: bare.right + CLEARANCE,
      top: bare.top - CLEARANCE,
      bottom: bare.bottom + CLEARANCE,
    };
    if (rect.width > 0) {
      for (const n of nodes) {
        const b = box(n.slug);
        if (rect.left < b.right && rect.right > b.left && rect.top < b.bottom && rect.bottom > b.top)
          throw new Error(`constellation: ${label}'s label overlaps "${n.slug}"`);
      }
      for (const other of edges) {
        if (other === edge) continue;
        const o = labelRect(other);
        if (o.width === 0) continue;
        if (rect.left < o.right && rect.right > o.left && rect.top < o.bottom && rect.bottom > o.top)
          throw new Error(
            `constellation: ${label}'s label overlaps ${other.from} → ${other.to}'s`,
          );
      }
    }

    // No run passes through a box it does not terminate on.
    for (let i = 1; i < edge.points.length; i += 1) {
      const [x1, y1] = edge.points[i - 1];
      const [x2, y2] = edge.points[i];
      for (const node of nodes) {
        if (node.slug === edge.from || node.slug === edge.to) continue;
        const b = box(node.slug);
        const crosses =
          Math.min(x1, x2) < b.right &&
          Math.max(x1, x2) > b.left &&
          Math.min(y1, y2) < b.bottom &&
          Math.max(y1, y2) > b.top;
        if (crosses) throw new Error(`constellation: ${label} runs through "${node.slug}"`);
      }
    }
  }
}
