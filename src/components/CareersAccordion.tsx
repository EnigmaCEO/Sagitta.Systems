"use client";

import { useState } from "react";
import type { CareerArea } from "@/data/content";

function getHiringMode(area: CareerArea): { label: string; color: string } {
  if (area.roles.length === 0) {
    return { label: "Upcoming", color: "var(--text-tertiary)" };
  }
  const openRoles = area.roles.filter((r) => r.description !== "Closed");
  if (openRoles.length > 0) {
    return { label: "Actively hiring", color: "#34d399" };
  }
  return { label: "Closed", color: "var(--text-tertiary)" };
}

export default function CareersAccordion({ areas }: { areas: CareerArea[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-2">
      {areas.map((area, i) => {
        const isOpen = openIndex === i;
        const hiring = getHiringMode(area);
        const openRoles = area.roles.filter((r) => r.description !== "Closed");
        const displayRoles = openRoles.length > 0 ? openRoles : area.roles;

        return (
          <div
            key={area.product}
            className="rounded-xl border overflow-hidden transition-colors duration-150"
            style={{
              borderColor: isOpen ? "var(--border-hover)" : "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <button
              className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-150"
              style={{
                backgroundColor: isOpen ? "var(--surface-2)" : "transparent",
                color: "var(--text-primary)",
              }}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold">{area.product}</span>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span
                  className="text-xs font-medium"
                  style={{ color: hiring.color }}
                >
                  {hiring.label}
                </span>
                {area.roles.length > 0 && (
                  <span
                    className="text-xs tabular-nums"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {area.roles.length} role{area.roles.length !== 1 ? "s" : ""}
                  </span>
                )}
                <ChevronIcon isOpen={isOpen} />
              </div>
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.22s ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div className="px-6 pb-5 pt-2">
                  {area.roles.length === 0 ? (
                    <p className="text-xs py-2" style={{ color: "var(--text-tertiary)" }}>
                      No open roles yet. Check back soon or register your interest.
                    </p>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {displayRoles.map((role) => (
                        <div
                          key={role.title}
                          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4 rounded-lg border"
                          style={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold mb-1"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {role.title} - Remote
                            </p>
                            {role.description !== "Closed" && (
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {role.description}
                              </p>
                            )}
                          </div>
                          {role.description !== "Closed" && (
                            <a
                              href={`mailto:careers@sagitta.systems?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
                              className="text-xs font-semibold shrink-0 transition-opacity duration-150 hover:opacity-70 sm:pt-0.5"
                              style={{ color: "var(--accent)" }}
                            >
                              Apply
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <a
                    href={`mailto:careers@sagitta.systems?subject=${encodeURIComponent(
                      `Interest: ${area.product}`
                    )}`}
                    className="text-xs font-semibold transition-opacity duration-150 hover:opacity-70"
                    style={{ color: "var(--accent)" }}
                  >
                    Register interest →
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <p
        className="pt-6 text-sm text-center"
        style={{ color: "var(--text-secondary)" }}
      >
        Don&apos;t see the right role?{" "}
        <a
          href="mailto:careers@sagitta.systems"
          className="font-medium transition-opacity duration-150 hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          Register your interest
        </a>{" "}
        and we&apos;ll be in touch.
      </p>
    </div>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.22s ease",
        color: "var(--text-tertiary)",
      }}
    >
      <path
        d="M2.5 5l4.5 4 4.5-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
