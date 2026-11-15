"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  HEALTH_COLD_START_TIMEOUT_MS,
  HEALTH_REFRESH_MS,
  HEALTH_SLOW_MS,
  HEALTH_TIMEOUT_MS,
  healthChecksBySystem,
  type HealthCheck,
} from "@/content/health";
import { HEALTH_LABELS, overallState, probe, type HealthResult, type HealthState } from "@/lib/health";

type ResultsByUrl = Record<string, HealthResult>;

const HealthContext = createContext<{ results: ResultsByUrl; lastRunAt: string | null }>({
  results: {},
  lastRunAt: null,
});

function uniqueChecks(): HealthCheck[] {
  const byUrl = new Map<string, HealthCheck>();
  for (const checks of Object.values(healthChecksBySystem)) {
    for (const check of checks) if (!byUrl.has(check.url)) byUrl.set(check.url, check);
  }
  return [...byUrl.values()];
}

// The check list is static content, so it is built once at module load.
const ALL_CHECKS = uniqueChecks();

/** Runs every check once per refresh, deduplicated by URL, and shares results. */
export function HealthProvider({ children }: { children: ReactNode }) {
  const checks = ALL_CHECKS;
  const [results, setResults] = useState<ResultsByUrl>({});
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      const fetchImpl: typeof fetch = (input, init) => fetch(input, init);
      for (const check of checks) {
        probe(check, { fetchImpl, timeoutMs: check.timeoutMs ?? HEALTH_TIMEOUT_MS, slowMs: HEALTH_SLOW_MS }).then((result) => {
          if (cancelled) return;
          setResults((prev) => ({ ...prev, [check.url]: result }));
          setLastRunAt(result.checkedAt ?? new Date().toISOString());
        });
      }
    };

    run();
    const timer = window.setInterval(run, HEALTH_REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [checks]);

  return <HealthContext.Provider value={{ results, lastRunAt }}>{children}</HealthContext.Provider>;
}

const STATE_COLOR: Record<HealthState, string> = {
  checking: "var(--text-tertiary)",
  up: "#22c55e",
  slow: "#f59e0b",
  reachable: "#60a5fa",
  down: "#ef4444",
};

function Dot({ state }: { state: HealthState }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block rounded-full shrink-0"
      style={{ width: 8, height: 8, backgroundColor: STATE_COLOR[state] }}
    />
  );
}

/** Live check results for one system: its site and the services behind it. */
export function SystemHealth({ slug }: { slug: string }) {
  const { results } = useContext(HealthContext);
  const checks = healthChecksBySystem[slug] ?? [];
  if (checks.length === 0) return null;

  return (
    <ul className="mt-3 space-y-1" aria-label="Live checks">
      {checks.map((check) => {
        const result = results[check.url] ?? { state: "checking" as const };
        return (
          <li key={check.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <Dot state={result.state} />
            <span style={{ color: "var(--text-tertiary)", minWidth: "3.25rem" }}>
              {check.kind === "site" ? "Site" : "Service"}
            </span>
            <span className="font-mono" style={{ color: "var(--text-secondary)" }}>
              {check.label}
            </span>
            <span className="font-semibold" style={{ color: STATE_COLOR[result.state] }}>
              {HEALTH_LABELS[result.state]}
            </span>
            {typeof result.latencyMs === "number" && result.state !== "down" ? (
              <span style={{ color: "var(--text-tertiary)" }}>{result.latencyMs} ms</span>
            ) : null}
            {result.detail ? <span style={{ color: "var(--text-tertiary)" }}>· {result.detail}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

/** One-line network summary for the page hero. */
export function NetworkHealthSummary() {
  const { results, lastRunAt } = useContext(HealthContext);
  const checks = ALL_CHECKS;
  const all = checks.map((c) => results[c.url] ?? { state: "checking" as const });
  const state = overallState(all);
  const down = all.filter((r) => r.state === "down").length;

  const copy =
    state === "checking"
      ? `Running ${checks.length} live checks…`
      : down > 0
        ? `${down} of ${checks.length} checks down`
        : state === "slow"
          ? `All ${checks.length} checks answering, some slowly`
          : `All ${checks.length} checks answering`;

  return (
    <p className="flex items-center gap-2 text-sm" role="status" aria-live="polite">
      <Dot state={state} />
      <span style={{ color: "var(--text-primary)" }}>{copy}</span>
      {lastRunAt && state !== "checking" ? (
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          · checked from your browser at{" "}
          <time dateTime={lastRunAt}>{new Date(lastRunAt).toLocaleTimeString()}</time>, every minute
        </span>
      ) : null}
    </p>
  );
}

export function HealthLegend() {
  const items: { state: HealthState; copy: string }[] = [
    { state: "up", copy: "answered with a 2xx" },
    { state: "slow", copy: `answered after ${HEALTH_SLOW_MS / 1000}s` },
    { state: "reachable", copy: "answered, but the response can't be read from this site" },
    {
      state: "down",
      copy: `error, or no answer within ${HEALTH_TIMEOUT_MS / 1000}s (${HEALTH_COLD_START_TIMEOUT_MS / 1000}s for services that sleep when idle)`,
    },
  ];
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
      {items.map((item) => (
        <li key={item.state} className="flex items-center gap-1.5">
          <Dot state={item.state} />
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
            {HEALTH_LABELS[item.state]}
          </span>
          {item.copy}
        </li>
      ))}
    </ul>
  );
}
