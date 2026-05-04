"use client";

import Image from "next/image";
import type { EcosystemItem, ItemStatus } from "@/data/content";

type Door = EcosystemItem;

const statusConfig: Record<
  ItemStatus,
  { label: string; color: string; bg: string; border: string; dot?: string }
> = {
  Live: {
    label: "Live",
    color: "#34d399",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(52,211,153,0.22)",
    dot: "#34d399",
  },
  "Beta / Waitlist": {
    label: "Beta / Waitlist",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.22)",
  },
  Roadmap: {
    label: "Roadmap",
    color: "#6b7a8d",
    bg: "rgba(30,40,56,0.5)",
    border: "rgba(74,94,117,0.25)",
  },
};

export default function DoorCard({ door }: { door: Door }) {
  const s = statusConfig[door.status];
  const isRoadmap = door.status === "Roadmap";

  return (
    <a
      href={door.href}
      target="_blank"
      rel="noopener noreferrer"
      className="door-link h-full block"
      style={{ opacity: isRoadmap ? 0.8 : 1 }}
    >
      <div
        className="door-card flex flex-col h-full rounded-xl border p-6 transition-all duration-200"
        style={
          {
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            "--hover-border": s.color + "44",
          } as React.CSSProperties
        }
      >
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-5">
          {door.logo ? (
            <div
              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
              style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
            >
              <Image
                src={door.logo}
                alt={door.shortName}
                width={40}
                height={40}
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-xs font-bold shrink-0"
              style={{
                backgroundColor: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
              }}
            >
              {door.shortName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <StatusBadge status={door.status} />
        </div>

        {/* Title */}
        <h3
          className="text-sm font-semibold mb-2 leading-snug"
          style={{ color: isRoadmap ? "var(--text-secondary)" : "var(--text-primary)" }}
        >
          {door.name}
        </h3>

        {/* Description */}
        <p
          className="text-xs leading-relaxed flex-1 mb-3"
          style={{ color: isRoadmap ? "var(--text-tertiary)" : "var(--text-secondary)" }}
        >
          {door.description}
        </p>

        {/* Subdomain hint */}
        <p
          className="text-xs font-mono mb-5"
          style={{ color: "var(--text-tertiary)" }}
        >
          {door.subdomain}
        </p>

        {/* CTA */}
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: isRoadmap ? "var(--text-tertiary)" : s.color }}
        >
          {door.cta}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path
              d="M2 5.5h7M6 2.5l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}

function StatusBadge({ status }: { status: ItemStatus }) {
  const s = statusConfig[status];
  const showDot = status === "Live";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium shrink-0"
      style={{
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {showDot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: s.dot }}
        />
      )}
      {s.label}
    </span>
  );
}
