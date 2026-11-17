"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { LiveFigureSource } from "@/content/types";

/**
 * Live figures, read in the visitor's browser.
 *
 * The site is a static export, so every figure ships as the dated snapshot in
 * the content record — that is what crawlers, the content check and a visitor
 * with scripts off see. A figure with a `live` source is then re-read from the
 * product after mount and replaces the snapshot, relabelled as live. Any
 * failure (network, timeout, unexpected shape) leaves the snapshot in place:
 * the page never shows an empty or invented number.
 */

/** Hosts a live figure may be read from. Mirrored in scripts/check-content.mjs. */
export const LIVE_FIGURE_HOSTS = ["continuityengineserver.fly.dev"];

const TIMEOUT_MS = 6000;

function useLiveFigure(live: LiveFigureSource | undefined): number | null {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (!live) return;
    let url: URL;
    try {
      url = new URL(live.endpoint);
    } catch {
      return;
    }
    if (url.protocol !== "https:" || !LIVE_FIGURE_HOSTS.includes(url.hostname)) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetch(url, { signal: controller.signal, credentials: "omit" })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: unknown) => {
        const raw = body && typeof body === "object" ? (body as Record<string, unknown>)[live.field] : null;
        if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) setValue(raw);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [live]);

  return value;
}

function formatCount(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/**
 * The value, metric and provenance line of a signal-strip figure. Server
 * rendering produces the dated snapshot; the live read replaces both the value
 * and the "Snapshot as of" label together, so they can never disagree.
 */
export function LiveSignalBody({
  value,
  metric,
  asOf,
  asOfLabel,
  sourceName,
  live,
}: {
  value: string;
  metric: string;
  asOf: string | null;
  asOfLabel: string | null;
  sourceName: string;
  live: LiveFigureSource;
}) {
  const current = useLiveFigure(live);

  return (
    <>
      <p className="ticker-value mb-3" aria-live="polite">
        {current === null ? value : formatCount(current)}
      </p>

      <p className="text-sm leading-snug mb-2" style={{ color: "var(--text-secondary)" }}>
        {metric}
      </p>

      <p className="meta-line mb-4">
        {current !== null ? (
          <>
            Live from {live.label}
            <span aria-hidden="true"> · </span>
          </>
        ) : asOf && asOfLabel ? (
          <>
            Snapshot as of <time dateTime={asOf}>{asOfLabel}</time>
            <span aria-hidden="true"> · </span>
          </>
        ) : null}
        {sourceName}
      </p>
    </>
  );
}

/** A press-statistic value that updates to the live figure, with a small live label. */
export function LivePressValue({
  value,
  live,
  className,
  style,
}: {
  value: string;
  live: LiveFigureSource;
  className?: string;
  style?: CSSProperties;
}) {
  const current = useLiveFigure(live);

  return (
    <>
      <p className={className} style={style} aria-live="polite">
        {current === null ? value : formatCount(current)}
      </p>
      {current !== null ? (
        <p className="text-[0.6875rem] uppercase font-semibold mb-1" style={{ letterSpacing: "0.14em", color: "var(--text-tertiary)" }}>
          Live from {live.label}
        </p>
      ) : null}
    </>
  );
}
