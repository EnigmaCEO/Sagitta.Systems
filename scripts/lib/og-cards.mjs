// The Open Graph card set, derived from the content layer.
//
// ── Why this is derived rather than written ──────────────────────────────────
//
// It used to be a literal array in build-og.mjs, and on 2026-08-02 three of the
// ten cards were found to be publishing facts the site had already corrected:
//
//   - systems.png          said "Ten systems. Three families." The directory
//                          publishes eight, and check-content.mjs fails the
//                          build at any other number. The same file forbids a
//                          promotion from restating the count at all, with a
//                          pattern that matches the exact phrase on the card.
//   - family-allocation    listed "Selun x402" as a member of the family
//                          alongside AAA and Selun. It is a capability of
//                          Selun, not a system, and the correction that
//                          established that is swept for across the whole
//                          content layer.
//   - family-capital       named "the Treasury Decision Desk", which is not a
//                          Sagitta product and which check-content.mjs rejects
//                          outright wherever it appears in public copy.
//
// None of it was caught, because the copy lived in a script as string
// literals, the output is a committed binary nothing inspects, and the
// generator is not part of `npm run verify`. The social cards were the one
// publishing surface on this site with neither derivation nor validation —
// which is exactly why they were the surface that drifted, and they are the
// most-seen artifacts the site produces: a card is what renders on every share
// of its page in X, LinkedIn, Slack, and iMessage.
//
// So membership, counts, and family names now come from the same records the
// pages read. Voice and framing stay editorial — a card is still written, not
// generated — but no card can state a fact about the model that the model does
// not state itself.

const GOLD = "#d9b168";

export const FAMILY_ACCENT = {
  "continuity-defense": "#4ec8d8",
  "allocation-agent-intelligence": "#a78bfa",
  "capital-infrastructure": GOLD,
};

/** "A", "A and B", "A, B, and C". */
function sentenceList(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * Foundation first, then the services attached to it, then anything at concept
 * stage. The order carries the architecture — a family reads as a core with
 * services hanging off it — and it is derived from `systemKind` rather than
 * hand-sequenced, so adding a service cannot silently push the foundation down
 * the list.
 */
const KIND_ORDER = { core: 0, service: 1, concept: 2 };

function byArchitecture(a, b) {
  return (KIND_ORDER[a.systemKind] ?? 3) - (KIND_ORDER[b.systemKind] ?? 3);
}

/** Editorial framing per family. The membership beside it is derived. */
const FAMILY_COPY = {
  "continuity-defense": {
    title: "Keeping protocols operating through control failure.",
    trailer: "continuity doctrine, defense review, and infrastructure monitoring.",
  },
  "allocation-agent-intelligence": {
    title: "Deciding where capital goes.",
    trailer: "policy-governed allocation for institutions, individuals, and other agents.",
  },
  "capital-infrastructure": {
    title: "Holding and moving what the network decides on.",
    trailer: "the protocol layer and institutional settlement.",
  },
};

/**
 * The full card set for a loaded content layer.
 *
 * Both `build-og.mjs` and `check-og.mjs` call this, so the cards that get
 * rendered and the cards that get checked can never be two different sets.
 */
export function buildCards(content) {
  const { publicSystems, systemFamilies, systemsByFamily } = content;

  const familyCards = [...systemFamilies]
    .sort((a, b) => a.order - b.order)
    .map((family) => {
      // Systems only. A capability is delivered through a system and is not a
      // member of a family, which is the distinction the allocation card got
      // wrong by naming Selun x402 as a peer of the two systems.
      const members = [...systemsByFamily(family.id)].sort(byArchitecture).map((s) => s.name);
      const copy = FAMILY_COPY[family.id];

      return {
        file: `family-${family.id.split("-")[0]}.png`,
        accent: FAMILY_ACCENT[family.id],
        eyebrow: family.name,
        title: copy.title,
        subtitle: `${sentenceList(members)} — ${copy.trailer}`,
        footer: `sagitta.systems/systems#${family.id}`,
      };
    });

  return [
    {
      file: "home.png",
      accent: GOLD,
      eyebrow: "The Sagitta Systems Network",
      title: "Continuity, allocation, and capital infrastructure.",
      // The homepage does not restate the system count and neither does its
      // card. The directory owns the count.
      subtitle:
        "What the network is seeing and doing now — with the route into the system that supports the next decision.",
      footer: "sagitta.systems",
    },
    {
      file: "systems.png",
      accent: GOLD,
      eyebrow: "Systems directory",
      // The count is the one place a card may state it, and it is read from
      // the records rather than typed.
      title: `${publicSystems.length} systems. ${systemFamilies.length} families.`,
      subtitle:
        "Every record states what the system is, what you can use today, and what evidence supports its operating state.",
      footer: "sagitta.systems/systems",
    },
    {
      file: "newsroom.png",
      accent: "#8fb6e8",
      eyebrow: "Newsroom",
      title: "The record of what Sagitta has published.",
      subtitle:
        "Research notes, reports, documents, and dated system updates from the desks that are running.",
      footer: "sagitta.systems/newsroom",
    },
    {
      file: "roadmap.png",
      accent: "#35d39a",
      eyebrow: "Roadmap",
      title: "Now, Next, Horizon.",
      subtitle:
        "Every milestone carries an evidence-based state and links to what supports it. No dates are claimed, because none are committed.",
      footer: "sagitta.systems/roadmap",
    },
    {
      file: "careers.png",
      accent: GOLD,
      eyebrow: "Careers",
      title: "Build with Sagitta.",
      subtitle:
        "Open roles with published terms, a contributor network, and future workstreams — each held clearly apart.",
      footer: "sagitta.systems/careers",
    },
    {
      file: "about.png",
      accent: "#a78bfa",
      eyebrow: "About",
      title: "The development identity behind the network.",
      subtitle:
        "Sagitta Systems builds and documents the systems, and operates within Sagitta Labs — the emerging umbrella brand.",
      footer: "sagitta.systems/about",
    },
    {
      file: "press.png",
      accent: GOLD,
      eyebrow: "Press room",
      title: "Sourced, scoped, and dated.",
      subtitle:
        "Approved descriptions, one leadership profile, marks and diagrams, and every figure with its source and verification date.",
      footer: "sagitta.systems/press",
    },
    ...familyCards,
  ];
}
