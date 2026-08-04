import Image from "next/image";
import { getFamily, getSystem } from "@/content/systems";
import { FamilyIcon } from "./FamilyMark";

/**
 * A system's identity asset, for scanning rather than reading.
 *
 * ── One slot, two shapes ─────────────────────────────────────────────────────
 *
 * Systems publish two kinds of asset and they are not interchangeable: square
 * product marks (Radar, AAA, SCE, Defense, Protocol, Selun) and horizontal name
 * lockups (Sagitta Banking, at 3.47:1). Sizing by width alone squashes the
 * lockup to an illegible 34×10; sizing by height alone makes it 118px wide and
 * knocks every row out of alignment.
 *
 * So the slot is a fixed box — constant `width` and `height` at every call site
 * — and the asset is contained inside it. A square mark fills the height and
 * centres; a lockup fills the width and centres. Neither is distorted, and the
 * column stays aligned down the page because the box never changes size.
 *
 * ── Fallback ─────────────────────────────────────────────────────────────────
 *
 * Not every system has either asset — Sagitta Wallet has none — so the family
 * motif fills the same slot rather than leaving a hole in a column of icons.
 * All three are identity: none depicts an interface, which is what keeps this
 * clear of the rule against simulating a product screenshot.
 *
 * Always decorative. Every place this renders already publishes the system name
 * as text, usually as a link, so announcing the asset too would just repeat it.
 */
export default function SystemMark({
  systemSlug,
  height = 40,
  width,
  style,
}: {
  systemSlug?: string;
  /** Slot height in px. A square mark renders at this size. */
  height?: number;
  /**
   * Slot width. Defaults to 2.4× the height, which is enough for a 3.47:1
   * lockup to fill the width without a square mark looking lost in the gap.
   */
  width?: number | string;
  style?: React.CSSProperties;
}) {
  const system = systemSlug ? getSystem(systemSlug) : undefined;
  if (!system) return null;

  const slot: React.CSSProperties = {
    width: width ?? Math.round(height * 2.4),
    height,
    ...style,
  };

  // A square mark is preferred at icon scale; the lockup is what exists for
  // systems that have no mark of their own.
  const asset = system.logo ?? system.wordmark;

  if (asset) {
    return (
      <span
        aria-hidden="true"
        className="shrink-0 inline-flex items-center justify-center"
        style={slot}
      >
        <Image
          src={asset}
          alt=""
          // Intrinsic hints only — they prevent layout shift before load. The
          // real aspect ratio comes from the file, because the style below
          // leaves both axes auto and constrains them to the slot instead.
          width={system.logo ? 160 : 660}
          height={system.logo ? 160 : 190}
          sizes={`${typeof slot.width === "number" ? slot.width * 2 : 240}px`}
          className="object-contain"
          style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }}
        />
      </span>
    );
  }

  const family = getFamily(system.family);
  if (!family) return null;

  return (
    <span
      aria-hidden="true"
      className="shrink-0 inline-flex items-center justify-center"
      style={{ color: "var(--family-accent)", ...slot }}
    >
      {/* A line icon reads heavier than a mark at the same box size. */}
      <FamilyIcon motif={family.motif} size={Math.round(height * 0.72)} />
    </span>
  );
}
