// Browser-side health probes for the network status page. Pure apart from the
// injected `fetch`, so the classification rules are unit-tested without a DOM.

import type { HealthCheck } from "@/content/health";

export type HealthState = "checking" | "up" | "slow" | "reachable" | "down";

export interface HealthResult {
  state: HealthState;
  latencyMs?: number;
  /** HTTP status when the response could be read. */
  status?: number;
  detail?: string;
  checkedAt?: string;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface ProbeOptions {
  fetchImpl: FetchLike;
  timeoutMs: number;
  slowMs: number;
  now?: () => number;
}

const JSON_RPC_BODY = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] });

function requestInit(check: HealthCheck, mode: RequestMode, signal: AbortSignal): RequestInit {
  if (check.jsonRpc) {
    // no-cors only permits "simple" requests, so the fallback drops the JSON
    // content type; the reachability answer is still meaningful.
    return {
      method: "POST",
      mode,
      cache: "no-store",
      signal,
      body: JSON_RPC_BODY,
      headers: mode === "cors" ? { "Content-Type": "application/json" } : undefined,
    };
  }
  return { method: "GET", mode, cache: "no-store", signal };
}

function isTimeout(error: unknown): boolean {
  return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}

/**
 * Probe one check.
 *   - readable 2xx within `slowMs`      → up
 *   - readable 2xx slower than `slowMs` → slow
 *   - readable non-2xx                  → down (with status)
 *   - unreadable (CORS) but answered    → reachable
 *   - no answer, network error, timeout → down
 */
export async function probe(check: HealthCheck, options: ProbeOptions): Promise<HealthResult> {
  const now = options.now ?? (() => Date.now());
  const startedAt = now();
  const finish = (result: Omit<HealthResult, "latencyMs" | "checkedAt">): HealthResult => ({
    ...result,
    latencyMs: Math.round(now() - startedAt),
    checkedAt: new Date(now()).toISOString(),
  });

  try {
    const response = await options.fetchImpl(
      check.url,
      requestInit(check, "cors", AbortSignal.timeout(options.timeoutMs)),
    );
    if (!response.ok) return finish({ state: "down", status: response.status, detail: `HTTP ${response.status}` });
    const elapsed = now() - startedAt;
    return finish({ state: elapsed > options.slowMs ? "slow" : "up", status: response.status });
  } catch (error) {
    if (isTimeout(error)) return finish({ state: "down", detail: "No response before timeout" });
  }

  // The CORS read failed. Either the target is down, or it answered without
  // allowing this origin to read the response. An opaque request tells them apart.
  const remainingMs = Math.max(1_000, options.timeoutMs - (now() - startedAt));
  try {
    await options.fetchImpl(check.url, requestInit(check, "no-cors", AbortSignal.timeout(remainingMs)));
    return finish({ state: "reachable", detail: "Answered; response not readable cross-origin" });
  } catch (error) {
    return finish({
      state: "down",
      detail: isTimeout(error) ? "No response before timeout" : "Could not connect",
    });
  }
}

const SEVERITY: Record<HealthState, number> = { checking: 0, up: 1, reachable: 2, slow: 3, down: 4 };

/** The worst state across a set of results; `checking` until every result is in. */
export function overallState(results: HealthResult[]): HealthState {
  if (results.length === 0 || results.some((r) => r.state === "checking")) return "checking";
  return results.reduce<HealthState>(
    (worst, r) => (SEVERITY[r.state] > SEVERITY[worst] ? r.state : worst),
    "up",
  );
}

export const HEALTH_LABELS: Record<HealthState, string> = {
  checking: "Checking",
  up: "Up",
  slow: "Slow",
  reachable: "Reachable",
  down: "Down",
};
