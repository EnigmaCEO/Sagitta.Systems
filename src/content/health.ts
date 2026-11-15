// What the network status page checks, per system.
//
// Two kinds of check, kept separate because the site can be live while the
// service behind it is not:
//   - `site`: the public surface on its subdomain answers.
//   - `service`: the backend or chain the product depends on answers.
//
// Checks run in the visitor's browser (sagitta.systems is a static export, so
// there is no server to run them). A target that does not allow cross-origin
// reads can still be confirmed as reachable, but its response cannot be read;
// the page reports that as "Reachable" rather than claiming it is healthy.
//
// Thresholds are deliberately generic to start: a check passes if it answers
// within the timeout with a 2xx response.

export type HealthCheckKind = "site" | "service";

export interface HealthCheck {
  id: string;
  kind: HealthCheckKind;
  label: string;
  url: string;
  /** JSON-RPC chain checks POST eth_blockNumber; everything else is a GET. */
  jsonRpc?: boolean;
  /** Overrides HEALTH_TIMEOUT_MS for a service that sleeps when idle. */
  timeoutMs?: number;
}

export const HEALTH_TIMEOUT_MS = 10_000;
export const HEALTH_SLOW_MS = 5_000;
export const HEALTH_REFRESH_MS = 60_000;
/** For services that scale to zero: a cold start (~7–12s) reads as slow, not down. */
export const HEALTH_COLD_START_TIMEOUT_MS = 20_000;

const SCE_API = "https://continuityengineserver.fly.dev/health";

function site(slug: string, host: string): HealthCheck {
  return { id: `${slug}:site`, kind: "site", label: host, url: `https://${host}/` };
}

export const healthChecksBySystem: Record<string, HealthCheck[]> = {
  "sagitta-continuity-engine": [
    site("sce", "sce.sagitta.systems"),
    { id: "sce:api", kind: "service", label: "SCE API", url: SCE_API },
  ],
  "sagitta-defense": [
    site("defense", "defense.sagitta.systems"),
    { id: "defense:sce-api", kind: "service", label: "SCE API (incident feed)", url: SCE_API },
  ],
  "sagitta-radar": [
    site("radar", "radar.sagitta.systems"),
    { id: "radar:sce-api", kind: "service", label: "SCE API (alert feed)", url: SCE_API },
  ],
  aaa: [
    site("aaa", "aaa.sagitta.systems"),
    {
      id: "aaa:api",
      kind: "service",
      label: "AAA API",
      url: "https://sagitta-aaa-api.fly.dev/healthz",
      // Runs with min_machines_running = 0, so the first check may wake it.
      timeoutMs: HEALTH_COLD_START_TIMEOUT_MS,
    },
  ],
  selun: [
    site("selun", "selun.sagitta.systems"),
    { id: "selun:backend", kind: "service", label: "Selun backend", url: "https://selunagent.fly.dev/health" },
    {
      id: "selun:x402",
      kind: "service",
      label: "x402 discovery document",
      url: "https://selun.sagitta.systems/.well-known/x402",
    },
  ],
  "sagitta-protocol": [
    site("protocol", "protocol.sagitta.systems"),
    { id: "protocol:arc", kind: "service", label: "Arc Testnet RPC", url: "https://rpc.testnet.arc.network", jsonRpc: true },
    {
      id: "protocol:moonbase",
      kind: "service",
      label: "Moonbase Alpha RPC",
      url: "https://moonbeam-alpha.api.onfinality.io/public",
      jsonRpc: true,
    },
  ],
  // Banking and Wallet run no live service; only the site is checked.
  "sagitta-banking": [site("banking", "banking.sagitta.systems")],
  "sagitta-wallet": [site("wallet", "wallet.sagitta.systems")],
};
