"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Measurement for the call-to-action taxonomy the site already carries.
 *
 * ── What this closes ─────────────────────────────────────────────────────────
 *
 * `CtaLink` has emitted `data-cta`, `data-cta-type`, `data-cta-availability`,
 * and `data-cta-audience` since Phase 3, and its own comment said "nothing
 * reads those attributes at runtime — they exist so a future analytics pass
 * can measure system entry, operating-product visits, documentation visits,
 * Defense Review inquiries, partnership inquiries, press inquiries, and career
 * actions without re-instrumenting every template." This is that pass. Not one
 * line of template markup changed to enable it.
 *
 * It matters beyond convenience: the editorial rotation rules in
 * PROMOTION_COVERAGE.md decide which promotion leads and which is archived, and
 * until now every one of those decisions was made without any signal about
 * which stage a reader actually enters the network through. The site holds
 * every content claim to a verified source; the promotional decisions were the
 * one place nothing was measured.
 *
 * ── What it sends, and what it refuses to ────────────────────────────────────
 *
 * Only what the taxonomy already describes: which action was taken, what kind
 * of journey it starts, whether the destination was usable, and the route it
 * was taken from.
 *
 * There is no cookie, no `localStorage`, no `sessionStorage`, no device or
 * browser fingerprint, no identifier of any kind, and no third-party script.
 * Nothing is loaded from another origin, so the page makes no external request
 * on load — the property the Watch stage was built to preserve holds here too.
 * Events cannot be joined into a session, because nothing is emitted that could
 * join them.
 *
 * Three conditions each independently disable it:
 *
 *   - **No endpoint configured.** `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is inlined
 *     at build time; with it unset this component is inert. That is the default
 *     and it means no data can leave a build that was not deliberately
 *     configured to send it.
 *   - **Do Not Track.** Honoured as a directive rather than a preference.
 *   - **Global Privacy Control.** Same.
 *
 * The endpoint is expected to be first-party or self-hosted. Pointing it at a
 * third-party surveillance analytics product would satisfy the code and defeat
 * the reasoning above, so don't.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

interface AnalyticsEvent {
  event: "cta" | "view";
  /** Route the event happened on. Never includes a query string or hash. */
  path: string;
  /** `data-cta` — the stable action id from the content layer. */
  id?: string;
  /** `data-cta-type` — one of the twelve action types. */
  type?: string;
  /** `data-cta-availability` — available, by-request, or documented. */
  availability?: string;
  /** `data-cta-audience`, where the action declares one. */
  audience?: string;
}

/** True where the reader has signalled that they do not want to be measured. */
function optedOut(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & {
    doNotTrack?: string;
    globalPrivacyControl?: boolean;
  };
  const dnt =
    nav.doNotTrack ??
    (window as Window & { doNotTrack?: string }).doNotTrack ??
    undefined;
  return dnt === "1" || dnt === "yes" || nav.globalPrivacyControl === true;
}

function send(event: AnalyticsEvent): void {
  if (!ENDPOINT) return;
  const body = JSON.stringify(event);

  // `sendBeacon` survives the navigation the click is about to cause, which a
  // fetch from a unloading document does not reliably do. The fetch fallback is
  // for browsers without it, and keepalive gives it the same property.
  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch(ENDPOINT, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    mode: "no-cors",
  }).catch(() => {
    // Measurement never interferes with the reader's navigation.
  });
}

export default function CtaAnalytics() {
  const pathname = usePathname();
  // Guards against double-counting a view when React re-runs the effect without
  // the route having actually changed.
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!ENDPOINT || optedOut()) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // A view is sent so the CTA counts have a denominator. Without it "eleven
    // people opened Defense" is a number with no meaning attached.
    send({ event: "view", path: pathname });
  }, [pathname]);

  useEffect(() => {
    if (!ENDPOINT || optedOut()) return;

    function onClick(clickEvent: MouseEvent) {
      const target = clickEvent.target;
      if (!(target instanceof Element)) return;

      // One delegated listener rather than a handler per link: every current
      // and future `data-cta` is covered without touching a template, which is
      // the whole point of having put the attributes in the content layer.
      const element = target.closest<HTMLElement>("[data-cta]");
      if (!element) return;

      send({
        event: "cta",
        path: window.location.pathname,
        id: element.dataset.cta,
        type: element.dataset.ctaType,
        availability: element.dataset.ctaAvailability,
        audience: element.dataset.ctaAudience,
      });
    }

    // Capture phase, so the event is recorded even where something downstream
    // stops propagation.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
